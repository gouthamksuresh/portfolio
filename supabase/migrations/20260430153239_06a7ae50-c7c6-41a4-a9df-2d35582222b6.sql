-- Roles
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users see own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (uid, 'admin');
  RETURN true;
END;
$$;

CREATE TABLE public.portfolio_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text UNIQUE NOT NULL,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read portfolio" ON public.portfolio_content
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin insert portfolio" ON public.portfolio_content
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update portfolio" ON public.portfolio_content
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete portfolio" ON public.portfolio_content
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.touch_portfolio_content()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  NEW.updated_by := auth.uid();
  RETURN NEW;
END;
$$;
CREATE TRIGGER portfolio_content_touch
  BEFORE UPDATE ON public.portfolio_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_portfolio_content();

ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_content;

INSERT INTO public.portfolio_content(section, data) VALUES
  ('identity', '{"fullName":"Goutham K Suresh","displayName":"GOUTHAM K SURESH","pronouns":"He/Him","title":"Cloud & DevOps Engineer","tagline":"Docker • Kubernetes • Jenkins • AWS • Python","location":"Bengaluru, Karnataka, India","email":"me.goutham.tech@gmail.com","phone":"+91 9746154656","linkedin":"https://linkedin.com/in/gouthamksuresh","github":"https://github.com/gouthamksuresh","bio":"Self-taught DevOps enthusiast and recent BCA graduate with AI specialization. I learn by doing — building lab environments, breaking things, and shipping CI/CD pipelines that actually work.","philosophy":"I believe in learning by doing. Started my DevOps journey by setting up personal labs, breaking things, and fixing them. Continuous self-learning keeps me updated with emerging cloud and DevOps tech.","highlights":["Self-taught DevOps & cloud through hands-on practice","Built personal labs for Docker, K8s & CI/CD","Real-world internships at Elevate Labs & Prinston","Active in tech webinars, workshops & meetups","Ships full-stack apps & automation tools solo","Always learning — chasing what''s next"]}'::jsonb),
  ('openToWork', '{"status":true,"availability":"Immediately Available","workMode":["Remote","On-site","Hybrid"],"relocate":true,"roles":["DevOps Intern","Cloud Engineer Intern","Software Engineer Intern","SRE Intern","Platform Engineer Intern","Junior DevOps Engineer","Junior Cloud Engineer","Associate Cloud Engineer","Cloud Operations Engineer","DevOps Associate","Automation Engineer","Build & Release Engineer","Cloud Support Engineer","Infrastructure Engineer","Junior SRE","Backend Developer Intern","Full Stack Developer Intern","Data Engineer Intern","MLOps Intern"]}'::jsonb),
  ('experience', '[{"id":1,"role":"DevOps Engineer","company":"Elevate Labs","type":"Internship · Remote","duration":"Sep 2025 – Dec 2025","commit":"a1f3c92","branch":"feat/ci-cd","description":"Worked extensively with modern DevOps tools — Jenkins, Docker, Kubernetes & GitHub Actions. Automated build/deploy pipelines, containerized apps, and shipped services on K8s clusters.","bullets":["Automated build & deployment pipelines using Jenkins and GitHub Actions","Containerized applications with Docker and deployed to Kubernetes","Owned Git/GitHub workflows — branching, PR reviews, releases","Set up CI/CD monitoring and debugged deployment failures","Improved deployment reliability and reduced manual intervention"],"stack":["Jenkins","Docker","Kubernetes","GitHub Actions","Git","CI/CD"]},{"id":2,"role":"Data Science Intern","company":"Prinston Smart Engineers","type":"Internship · Bengaluru","duration":"Jan 2025 – Apr 2025","commit":"8d2b7fe","branch":"feat/data-pipeline","description":"Applied data-driven techniques and analytical methodologies to solve real-world problems using Python and the PyData stack.","bullets":["Performed data analysis and preprocessing with Python & Pandas","Built data pipelines for efficient processing workflows","Created visualizations and insights from complex datasets","Collaborated on data-driven projects with cross-functional team"],"stack":["Python","Pandas","Data Analysis","Data Preprocessing"]}]'::jsonb),
  ('projects', '[{"id":1,"title":"CI/CD Pipeline — GitHub Actions & Docker","slug":"ci-cd-pipeline","duration":"Nov 2025 – Dec 2025","tagline":"Automated build → test → deploy in one push","description":"End-to-end CI/CD pipeline using GitHub Actions and Docker. Automates build, test, and deployment, containerizes the app for consistent environments, and dramatically reduces manual intervention.","features":["Automated build, test, and deploy on every push","Docker containerization for environment parity","GitHub Actions workflows with reusable jobs","Reliable rollouts, faster recovery from failures"],"stack":["GitHub Actions","Docker","Jenkins","CI/CD","Bash"],"github":"https://github.com/gouthamksuresh","pipeline":["Checkout","Build","Test","Containerize","Deploy"]},{"id":2,"title":"Internship Management System","slug":"ims","duration":"Dec 2024 – Mar 2025","tagline":"Full-stack platform automating internship coordination","description":"Full-stack web app coordinating students, recruiters, and administrators. Role-based dashboards, intelligent resume scanning with keyword detection, and automated feedback generation.","features":["Role-based dashboards (student / recruiter / admin)","Intelligent resume scanning with keyword detection","Automated feedback generation","Modular, scalable architecture","Responsive UI with cross-browser support"],"stack":["Python","Flask","SQLite","JavaScript","HTML","CSS"],"github":"https://github.com/gouthamksuresh","metrics":[{"label":"Workload reduction","value":70,"suffix":"%"},{"label":"Processing time saved","value":50,"suffix":"%"},{"label":"Task efficiency","value":3,"suffix":"x"},{"label":"Match accuracy gain","value":45,"suffix":"%"}]}]'::jsonb),
  ('skills', '{"Languages":["Python","JavaScript","SQL"],"DevOps & Cloud":["Docker","Kubernetes","Jenkins","GitHub Actions","AWS","GCP","CI/CD","Linux"],"Frameworks":["Flask","Pandas"],"Databases":["SQLite","MySQL","PostgreSQL"],"Tools":["Git","GitHub","Linux"],"Specializations":["Cloud Computing","Artificial Intelligence","Data Science","Cybersecurity","Data Preprocessing"]}'::jsonb),
  ('education', '[{"degree":"Bachelor of Computer Applications (BCA)","specialization":"Artificial Intelligence","institution":"Bengaluru North University","location":"Bengaluru, Karnataka","duration":"Sep 2022 – Aug 2025","status":"In Progress","focus":["Cloud Computing","Cybersecurity","AI","Machine Learning","Data Science"]},{"degree":"Higher Secondary","specialization":"Computer Science","institution":"St. Joseph HSS Mathilakam","location":"Mathilakam, Kerala","duration":"Mar 2020 – Mar 2022","status":"Completed","focus":["Computer Science","Mathematics","Physics"]}]'::jsonb),
  ('certifications', '[{"title":"SQL (Basic)","issuer":"HackerRank","date":"Jul 2025","credentialId":"5eea09dcbf49","tags":["SQL"]},{"title":"AWS APAC — Solutions Architecture Job Simulation","issuer":"Forage","date":"Jun 2025","credentialId":"RSa8zY5wDXFz39DN8","tags":["AWS","Cloud Architecture"]},{"title":"Introduction to Ethical Hacking","issuer":"Offenso Hackers Academy","date":"Mar 2023","tags":["Ethical Hacking","Cybersecurity","Network Security"]},{"title":"Artificial Intelligence with Python","issuer":"KEONICS","date":"Oct 2022","tags":["AI","Python","Machine Learning"]},{"title":"Google Cloud Fundamentals","issuer":"Qwiklabs","date":"Completed","tags":["GCP","Cloud Computing"]}]'::jsonb),
  ('languages', '[{"name":"English","level":"Full professional"},{"name":"Malayalam","level":"Native / bilingual"},{"name":"Hindi","level":"Limited working"}]'::jsonb),
  ('heroSequence', '[{"cmd":"whoami","out":["goutham — cloud & devops engineer (self-taught, ship-first)"]},{"cmd":"cat about.txt","out":["→ BCA in AI · Bengaluru North University","→ Internships @ Elevate Labs, Prinston Smart Engineers","→ Lives in containers, breathes pipelines"]},{"cmd":"kubectl get skills -n production","out":["NAME              READY   STATUS    AGE","docker            1/1     Running   3y","kubernetes        1/1     Running   2y","jenkins           1/1     Running   1y","github-actions    1/1     Running   1y","aws · gcp         1/1     Running   1y"]},{"cmd":"echo $STATUS","out":["✔ open to work — ready to ship"]}]'::jsonb)
ON CONFLICT (section) DO NOTHING;