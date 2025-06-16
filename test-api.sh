#!/bin/bash

echo "Test de l'API avec la nouvelle clé..."

curl -X POST "http://localhost:3000/api/generate-workout" \
  -H "Content-Type: application/json" \
  -d @test-payload.json

echo "\nTest terminé."