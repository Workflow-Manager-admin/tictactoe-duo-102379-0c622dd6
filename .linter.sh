#!/bin/bash
cd /home/kavia/workspace/code-generation/tictactoe-duo-102379-0c622dd6/tic_tac_toe_duo
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

