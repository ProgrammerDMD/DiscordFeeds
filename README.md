![DiscordFeeds](https://github.com/ProgrammerDMD/DiscordFeeds/blob/main/Images/DiscordFeeds.png)

# Requirements
- [Kubernetes](https://kubernetes.io/) and a running cluster (like [minikube](https://minikube.sigs.k8s.io/docs/start/))
- [Helm](https://helm.sh/docs/intro/quickstart/) for installing the microservices, and [ArgoCD](https://github.com/argoproj/argo-cd) for simplifying deployments. 
- A PostgreSQL database
- A [Discord Bot](https://discord.com/developers/docs/quick-start/getting-started)
- A [paddle](https://www.paddle.com/) account (for payments)
- A [sentry](https://sentry.io/) account (for catching errors)
- A [smartproxy](https://smartproxy.com/) account (for omitting forbidden errors from Reddit and YouTube)
# Installation

1. Clone this repository using the terminal:
```
git clone https://github.com/ProgrammerDMD/DiscordFeeds
```
2. Make sure each chart (API, Frontend, Bot), in their respective directories, contains valid values.
3. Deploy a development environment using the terminal:
```
skaffold dev
```
