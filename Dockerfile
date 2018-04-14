FROM node:6

ARG GIT=https://github.com/andiwand/gatekeeper.node.git
ARG APP_DIR="/gatekeeper"
ARG CONFIG_DIR="/config"
ARG CONTENT_DIR="/public"

RUN set -x \
    && git clone "${GIT}" "${APP_DIR}" \
    && cd "${APP_DIR}" \
    && mkdir -p "${CONFIG_DIR}" "${CONTENT_DIR}" \
    && npm install \
    && mv "config.json" "${CONFIG_DIR}" \
    && mv -T "public" "${CONTENT_DIR}" || true

VOLUME [ "${CONFIG_DIR}", "${CONTENT_DIR}" ]

ENV APP_DIR="${APP_DIR}" \
    CONFIG_DIR="${CONFIG_DIR}" \
    CONTENT_DIR="${CONTENT_DIR}"

CMD node "${APP_DIR}/app.js" "${CONFIG_DIR}/config.json"

