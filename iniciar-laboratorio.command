#!/bin/sh
set -eu

course_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
course_port="8767"
course_url="http://127.0.0.1:${course_port}/laboratorio.html"
course_log="/tmp/circulo-gold-laboratorio-${course_port}.log"
course_pid="/tmp/circulo-gold-laboratorio-${course_port}.pid"

cd "$course_dir"

if lsof -nP -iTCP:"$course_port" -sTCP:LISTEN >/dev/null 2>&1; then
  open "$course_url"
  exit 0
fi

nohup python3 -m http.server "$course_port" --bind 127.0.0.1 >"$course_log" 2>&1 &
course_server_pid="$!"
printf '%s\n' "$course_server_pid" >"$course_pid"

sleep 1

if ! lsof -nP -iTCP:"$course_port" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "No se pudo iniciar el laboratorio. Revisa: $course_log" >&2
  exit 1
fi

open "$course_url"
