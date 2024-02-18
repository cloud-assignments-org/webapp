packer {
  required_plugins {
    googlecompute = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

source "googlecompute" "centos" {
  project_id = var.project_id
  zone       = var.zone
  source_image_family = "centos-8"
  source_image_project_id = ["centos-cloud"]
  ssh_username = "packer"
  image_name   = var.image_name
}

build {
  sources = [
    "source.googlecompute.centos",
  ]

  provisioner "file" {
    source      = "../scripts/environmentSetUp.sh"
    destination = "/tmp/environmentSetUp.sh"
  }

  provisioner "shell" {
    inline = [
      "chmod +x /tmp/environmentSetUp.sh",
      "sh /tmp/environmentSetUp.sh"
    ]
  }

  provisioner "file" {
    source      = "../scripts/databaseSetup.sh"
    destination = "/tmp/databaseSetup.sh"
  }

  provisioner "shell" {
    inline = [
      "chmod +x /tmp/databaseSetup.sh",
      "sh /tmp/databaseSetup.sh"
    ]
  }
}
