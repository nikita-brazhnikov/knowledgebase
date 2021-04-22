# Developer's machine initial setup

## AWS access keys

1. Ask for to create new IAM user in AWS account you want to get access.
2. Get you IAM User's access credentials (username, password, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
3. Think out a short name for your AWS profile (for example, `abc-dev`)
4. Register new profile in `~/.aws/credentials` (create this file if it's not exists yet). Example:
```
[abc-dev]
aws_access_key_id = JO4239432879534
aws_secret_access_key = 574305457409537
```
5. Add new configuration in `~/.aws/config` (create if not exists yet). Example:
```
[profile default]
region = ap-northeast-1
output = json
[profile abc-dev]
region = ap-northeast-1
output = json
```
## GitHub SSH keys
Follow the [official GitHub manual](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

Check, whether you have an SSH key
```shell
ls -al ~/.ssh
# if you see this line, you already have a key
id_rsa.pub
```
### If you don't have an SSH key
```shell
ssh-keygen -t ed25519 -C "your_email@example.com"
```
When you are asked for location to store key files, leave the default. Entering the password adds an extra layer of security, but
is not neccessary.

### Add you SSH key in ssh-agent
The ssh-agent utility can manage you keys and provide it to other applications like git, ssh, homebrew etc.
* Manual way (run ssh-agent inside the current terminal session)
```shell
eval "$(ssh-agent -s)"
ssh-add -K ~/.ssh/<keyfile> 
```
`<keyfile>` without .pub extension
* Automatic start with terminal session
1. Open (or create and open) `~/.ssh/config`
2. Add the next lines
```yaml
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/<keyfile>
```
> You don't need `UseKeychain` if you chose not to add passphase to your key.

Start new terminal session and test your SSH connection with the following command:
```
ssh -T git@github.com
>Hi {username}! You've successfully authenticated, but GitHub does not provide shell access.
```
Ensure that your username is the same as your PNL's account's username.

## NodeJS
User [nvm](https://github.com/nvm-sh/nvm) for fast installation.
1. Run the next command
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```
2. Open new terminal window or tab and install the latest NodeJs with the next command
```
nvm install node
```

## AWS Tools

### Homebrew
If `brew` is not installed yet, install it
```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```
(sudo required)

### AWS CLI
https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html  
Install the latest AWS CLI 2 (for all users of your Mac)
```shell
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
aws --version
```
(sudo required)

### SAM CLI
```
brew tap aws/tap
brew install aws-sam-cli
sam --version
```

Install Docker (SAM CLI may require it in some builds )
```shell
brew cask install docker
```
