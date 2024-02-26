packer {
  required_plugins {
    googlecompute = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

source "googlecompute" "centos" {
  project_id          = var.project_xyz
  zone                = var.zone
  source_image_family = var.source_image_family
  ssh_username        = "centos"
  image_name          = var.image_name
}

build {
  sources = [
    "source.googlecompute.centos",
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
    source      = "../scripts/webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    inline = [
      "echo Copying service file to correct location",
      "sudo chmod +x /tmp/webapp.service",
      "ls -al /tmp/webapp.service",
      "echo copying service file to /etc/systemd/system/",
      "sudo cp /tmp/webapp.service /etc/systemd/system/.",
    ]
  }

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
    source      = "../scripts/simpleNodeInstallation.sh"
    destination = "/tmp/simpleNodeInstallation.sh"
  }

  provisioner "shell" {
    inline = [
      "sudo pwd",
      "echo Setting up node and other dependencies",
      "sudo chmod +x /tmp/simpleNodeInstallation.sh",
      "sudo sh /tmp/simpleNodeInstallation.sh"
    ]
  }

  provisioner "file" {
    source      = "dist.tar.gz"
    destination = "/tmp/dist.tar.gz"
  }

  # Extracting code and installing node modules
  provisioner "shell" {
    inline = [
      "echo Extracting code files to current directory and installing node modules",
      "pwd",
      "sudo mkdir /opt/webapp",
      "sudo chown -R centos:centos /opt/webapp",
      "tar -xzvf /tmp/dist.tar.gz -C /opt/webapp/.", // dist/src/index.js
      "rm /tmp/dist.tar.gz",
      "echo Code files extracted",
      "whoami",
      "ls -alh /opt/webapp/.",
      "echo installing dependencies",
      "cd /opt/webapp/.",
      "npm ci --omit=dev", // creates node modules
      "sudo chown -R csye6225:csye6225 /opt/webapp"
    ]
  }

  provisioner "shell" {
    inline = [
      "echo Starting service",
      "echo reloading daemon",
      "sudo systemctl daemon-reload",
      "echo enabling service on boot",
      "sudo systemctl enable webapp"
    ]
  }

}
