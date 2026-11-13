# Imagia

**Plateforme IA de création automatique de vidéos courtes.**

Imagia est un prototype front-end en français pour transformer une idée en concept de vidéo courte : accroche, déroulé scénarisé et aperçu des paramètres de publication.

## Lancer le prototype

Aucune installation n'est nécessaire. Ouvrez `index.html` dans un navigateur, ou servez le dossier avec un serveur HTTP local :

```bash
python3 -m http.server 8000
```

Puis rendez-vous sur <http://localhost:8000>.

## Fonctionnalités

- Brief vidéo avec compteur de caractères.
- Choix de la plateforme, de la durée et du ton.
- Génération locale d'une accroche et d'un script structuré par séquences.
- Copie du script et liste des concepts créés pendant la session.
- Interface responsive pour ordinateur et mobile.

## Limites du prototype

La génération est réalisée dans le navigateur à partir de modèles simples. L'aperçu est un concept visuel : aucun fichier vidéo n'est produit. Il n'y a pas encore de compte utilisateur, de sauvegarde persistante, de service IA connecté ou d'export vidéo.
