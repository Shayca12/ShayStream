# Jenkins LTS + Docker CLI.
# Jenkins יבנה images באמצעות ה-Docker daemon של ה-host (mount של הסוקט),
# ולכן צריך רק את ה-CLI בתוך הקונטיינר — לא daemon.
FROM jenkins/jenkins:lts-jdk17

USER root

# מתקינים את ה-Docker CLI (החבילה docker.io כוללת אותו).
RUN apt-get update \
  && apt-get install -y --no-install-recommends docker.io \
  && rm -rf /var/lib/apt/lists/*

# נשארים root כדי שתהיה גישה לסוקט של Docker (מוגדר גם ב-compose).
USER jenkins
