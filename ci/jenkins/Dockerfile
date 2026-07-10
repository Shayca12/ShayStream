# Jenkins LTS + Docker CLI (בינארי סטטי).
# Jenkins בונה images באמצעות ה-Docker daemon של ה-host (mount של הסוקט),
# ולכן צריך רק את ה-CLI. חבילת docker.io של Debian trixie לא כוללת את ה-CLI,
# אז מורידים את הבינארי הסטטי הרשמי ישירות — פתרון נקי ובלי תלות במאגרים.
FROM jenkins/jenkins:lts-jdk17

USER root

ARG DOCKER_VERSION=27.3.1
RUN curl -fsSL "https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz" \
  | tar -xz -C /usr/local/bin --strip-components=1 docker/docker \
  && docker --version

# נשארים root כדי שתהיה גישה לסוקט של Docker (מוגדר גם ב-compose).
USER jenkins
