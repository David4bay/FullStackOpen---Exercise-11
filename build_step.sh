#!/bin/bash

echo "Build script"
# export NODE_OPTIONS=--openssl-legacy-provider
npm install --legacy-peer-deps
npm run build