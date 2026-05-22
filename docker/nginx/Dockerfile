FROM nginx:alpine
# Bake the reverse-proxy config into an immutable image instead of
# bind-mounting it at runtime — no host path needed, so the stack
# deploys cleanly from CI (Jenkins agent -> host Docker daemon).
COPY nginx.conf /etc/nginx/conf.d/default.conf
