!#/bin/bash

tmux new-session -d -s quetzil
tmux send-keys -t quetzil:0 "npm run dev" C-m
