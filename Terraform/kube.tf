locals {
  hcloud_token = ""
}

module "kube-hetzner" {
  providers = {
    hcloud = hcloud
  }

  hcloud_token = var.hcloud_token != "" ? var.hcloud_token : local.hcloud_token

  source = "kube-hetzner/kube-hetzner/hcloud"

  ssh_public_key = file("keys/id_ed25519.pub")
  ssh_private_key = null

  network_region = "eu-central"

  control_plane_nodepools = [
    {
      name        = "control-plane-fsn1",
      server_type = "cax31",
      location    = "fsn1",
      labels      = [],
      taints      = [],
      count       = 1
    }
  ]

  agent_nodepools = [
    {
      name        = "agent-small",
      server_type = "cax11",
      location    = "fsn1",
      labels      = [],
      taints      = [],
      count       = 0
    }
  ]

  load_balancer_type     = "lb11"
  load_balancer_location = "fsn1"

  traefik_additional_options = [
    "--serverstransport.insecureskipverify=true"
  ]

  dns_servers = [
    "1.1.1.1",
    "8.8.8.8",
    "2606:4700:4700::1111",
  ]

  use_control_plane_lb = true
  control_plane_lb_type = "lb11"

  create_kubeconfig = false

  export_values = true

  firewall_kube_api_source = null
  block_icmp_ping_in = true
  # firewall_ssh_source = ["0.0.0.0/32"]

  extra_firewall_rules = [
    {
      description = "To Allow ArgoCD access to resources via SSH"
      direction       = "out"
      protocol        = "tcp"
      port            = "22"
      source_ips      = [] # Won't be used for this rule
      destination_ips = ["0.0.0.0/0", "::/0"]
    },
    {
      description = "Allow connecting to SmartProxy"
      direction       = "out"
      protocol        = "tcp"
      port            = "20000"
      source_ips      = [] # Won't be used for this rule
      destination_ips = ["0.0.0.0/0", "::/0"]
    }
  ]
}

provider "hcloud" {
  token = var.hcloud_token != "" ? var.hcloud_token : local.hcloud_token
}

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = ">= 1.43.0"
    }
  }
}

output "kubeconfig" {
  value     = module.kube-hetzner.kubeconfig
  sensitive = true
}

variable "hcloud_token" {
  sensitive = true
  default   = ""
}