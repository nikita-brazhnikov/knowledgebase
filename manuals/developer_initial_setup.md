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

Test your SSH connection with the following command:
```
ssh -T git@github.com
>Hi nikita-brazhnikov! You've successfully authenticated, but GitHub does not provide shell access.
```
Ensure that your username is the same as your PNL's account's username.

## NodeJS
User [nvm](https://github.com/nvm-sh/nvm) for fast install.
1. Run the next command
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
```
2. Open new terminal window or tab and install the latest NodeJs with the next command
```
nvm install node
```

## Python

