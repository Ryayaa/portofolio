# Antigravity Developer Skill: `portofolio-saya` Management

This document defines the custom development, testing, and deployment guidelines for the `portofolio-saya` project. Read this file with `IsSkillFile: true` to align with the project's standards and workflows.

---

## 1. Project Reference Context

*   **Project Name:** `portofolio-saya`
*   **Production Domain:** `https://arrya-fitriansyah.my.id` (and `www.arrya-fitriansyah.my.id`)
*   **Tech Stack:**
    *   **Frontend:** React 19, Vite, Tailwind CSS 4, PostCSS, Lucide React
    *   **3D Elements:** Three.js, `@react-three/fiber` (R3F), `@react-three/drei`, `@react-three/rapier` (physics), `meshline`
    *   **Animations:** GSAP, Framer Motion
*   **Server Stack:** Ubuntu, Nginx (1.18.0+), Certbot (Let's Encrypt SSL)
*   **Server Paths:**
    *   **Git Project Path on VM:** `~/portofolio-temp`
    *   **Nginx Server Block Config:** `/etc/nginx/sites-enabled/portofolio`
    *   **Nginx Document Root:** `/var/www/html/portofolio-saya`

---

## 2. Core Development Workflow

When modifying or adding features, follow this sequence to guarantee stability:

### Step 2.1: Code Modifications
1. Keep 3D components (like `Lanyard.jsx`) wrapped in `<Suspense>` and lazy-loaded to prevent main thread blocking.
2. Styling must use **Tailwind CSS 4** classes. Minimize inline styling or custom CSS unless doing complex shader work (e.g., in `DarkVeil` or `Galaxy`).

### Step 2.2: Local Verification
Prior to proposing any deployment or commits, verify the build locally:
```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Compile static assets
npm run build
```
Ensure the build completes with `exit code 0` and no syntax or bundler errors.

---

## 3. Production Deployment Workflow

Once changes are tested and verified, deploy them to the production server:

### Step 3.1: Remote Pull & Build
On the remote VM (`arrya306@instance-20260605-112950`):
1. Navigate to the project folder:
   ```bash
   cd ~/portofolio-temp
   ```
2. Pull the latest verified code:
   ```bash
   git pull origin main
   ```
3. Re-install packages and run production build:
   ```bash
   npm install
   npm run build
   ```

### Step 3.2: Copy Assets to Nginx Root
Move the newly compiled static files to the Nginx document root and set permissions:
```bash
# Ensure target folder exists
sudo mkdir -p /var/www/html/portofolio-saya

# Copy build artifacts
sudo cp -r dist/* /var/www/html/portofolio-saya/

# Set owner to web server user (www-data)
sudo chown -R www-data:www-data /var/www/html/portofolio-saya

# Reload Nginx server
sudo systemctl reload nginx
```

---

## 4. Diagnostics & Troubleshooting

Use these diagnostic guidelines if the site becomes unreachable or displays server/network errors:

### 4.1: Checking Web Server Status
```bash
# Verify Nginx status
sudo systemctl status nginx

# Verify port bindings (80 & 443)
sudo ss -tulpn | grep -E ":80|:443"
```

### 4.2: Inspecting Logs
```bash
# View last 50 lines of Nginx error logs
sudo tail -n 50 /var/log/nginx/error.log

# View last 50 lines of Nginx access logs
sudo tail -n 50 /var/log/nginx/access.log
```

### 4.3: Certbot SSL Maintenance
```bash
# Test automatic renewal process
sudo certbot renew --dry-run
```

### 4.4: Local DNS Resolution Check
To check if your local machine resolves to the correct IP (`34.34.218.119`):
```cmd
nslookup arrya-fitriansyah.my.id
```
If it displays the old Tencent Cloud IP (`43.129.49.24`), flush local DNS cache or switch to Google Public DNS (`8.8.8.8`).
