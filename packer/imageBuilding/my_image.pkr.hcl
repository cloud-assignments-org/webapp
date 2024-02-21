packer {
  required_plugins {
    googlecompute = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

source "googlecompute" "centos" {
  project_id              = var.project_id
  zone                    = var.zone
  source_image_family     = var.source_image_family
  source_image_project_id = var.source_image_project
  ssh_username            = "centos"
  image_name              = var.image_name
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
    source      = "../scripts/nodeJsInstallation.sh"
    destination = "/tmp/nodeJsInstallation.sh"
  }

  provisioner "shell" {
    inline = [
      "sudo pwd",
      "echo Setting up node and other dependencies",
      "sudo chmod +x /tmp/nodeJsInstallation.sh",
      "sudo sh /tmp/nodeJsInstallation.sh"
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
      "tar -xzvf /tmp/dist.tar.gz -C .", // dist
      "rm /tmp/dist.tar.gz",
      "echo Code files extracted",
      "whoami",
      "ls -alh .",
      "echo installing dependencies",
      "npm ci --omit=dev" // creates node modules
    ]
  }

  provisioner "shell" {
    inline = [
      "moving code to opt folder and setting the right permissions",
      "pwd",
      "mkdir webapp",
      "mv -t webapp package* node_modules dist .env*",
      "mv webapp/ ../../opt/.",
      "chown -R csye6225:csye6225 ../../opt/webapp", // dist
    ]
  }

  provisioner "file" {
    source      = "../scripts/webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    inline = [
      "Copying over the webapp service file",
      "cp /tmp/webapp.service /lib/systemd/system/webapp.service",
      "rm /tmp/webapp.service",
      "systemctl daemon-reload",
      "systemctl start webapp.service",
      "systemctl enable webapp.service"
    ]
  }


  provisioner "file" {
    source      = "../scripts/databaseSetUp.sh"
    destination = "/tmp/databaseSetUp.sh"
  }

  provisioner "shell" {
    inline = [
      "sudo pwd",
      "echo Setting up Database",
      "sudo chmod +x /tmp/databaseSetUp.sh",
      "sudo sh /tmp/databaseSetUp.sh"
    ]
  }

}
