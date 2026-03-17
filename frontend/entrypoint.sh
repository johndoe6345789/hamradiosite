#!/bin/sh
set -e

# Runtime substitution of NEXT_PUBLIC_* environment variables
# Next.js bakes NEXT_PUBLIC_* vars at build time. This script replaces
# the build-time placeholder (__NEXT_PUBLIC_API_URL__) with the actual
# runtime value so the same image works in any environment.

if [ -n "$NEXT_PUBLIC_API_URL" ]; then
  echo "Applying runtime NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
  find /app/.next /app/public -type f \( -name '*.js' -o -name '*.html' -o -name '*.json' \) -exec \
    sed -i "s|__NEXT_PUBLIC_API_URL__|${NEXT_PUBLIC_API_URL}|g" {} +
else
  echo "WARNING: NEXT_PUBLIC_API_URL is not set, using build-time default"
fi

exec "$@"
