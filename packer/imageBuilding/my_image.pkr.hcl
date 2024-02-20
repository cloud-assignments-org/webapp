packer {
  required_plugins {
    googlecompute = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

source "googlecompute" "root" {
  project_id              = var.project_id
  zone                    = var.zone
  source_image_family     = var.source_image_family
  source_image_project_id = var.source_image_project
  ssh_username            = "root"
  image_name              = var.image_name
}

build {
  sources = [
    "source.googlecompute.root",
  ]

  # Run this later if you also need to provide ssh access to this machine
  # provisioner "file" {
  #   source      = "./tf-packer.pub"
  #   destination = "/tmp/tf-packer.pub"
  # }

  # provisioner "shell" {
  #   script = "../scripts/sshSetUp.sh"
  # }

  provisioner "file" {
    source      = "../scripts/csye6225User.sh"
    destination = "/tmp/csye6225User.sh"
  }

  provisioner "shell" {
    inline = [
      "chmod +x /tmp/csye6225User.sh",
      "sh /tmp/csye6225User.sh"
    ]
  }

  provisioner "file" {
    source      = "dist.tar.gz"
    destination = "/tmp/dist.tar.gz"
  }

  provisioner "shell" {
    inline = [
      "cd ../home/csye6225/",
      "tar -xzvf /tmp/dist.tar.gz -C .",
      "sudo chown -R csye6225:csye6225 .",
      "rm /tmp/dist.tar.gz",
      "mv dist/src/* .",
      "rm -rf dist/"
    ]
  }

  provisioner "file" {
    source      = "../scripts/databaseSetUp.sh"
    destination = "/tmp/databaseSetUp.sh"
  }

  provisioner "shell" {
    inline = [
      "chmod +x /tmp/databaseSetUp.sh",
      "pwd",
      "sh /tmp/databaseSetUp.sh"
    ]
  }

  provisioner "file" {
    source      = "../scripts/environmentSetUp.sh"
    destination = "/tmp/environmentSetUp.sh"
  }

  provisioner "shell" {
    inline = [
      "chmod +x /tmp/environmentSetUp.sh",
      "pwd",
      "sh /tmp/environmentSetUp.sh"
    ]
  }

}
