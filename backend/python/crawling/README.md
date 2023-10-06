# zsh 및 oh-my-zsh 설치

sudo apt update

sudo apt install zsh

# root 비밀번호 생성하기
sudo passwd root 

# ubuntu 계정 비밀번호 생성하기

sudo su -

passwd ubuntu

chsh -s $(which zsh)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"


# powerlevel10k 설치
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

vi ~/.zshrc 열고
ZSH_THEME="powerlevel10k/powerlevel10k"

. ~/.zshrc


# 빌드 도구 및 종속성 설치 : python3.11을 빌드하기 위해 필요한 라이브러리와 도구 설치
sudo apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget libbz2-dev liblzma-dev llvm libncursesw5-dev tk-dev libkrb5-dev


# python3.11 소스 다운
wget https://www.python.org/ftp/python/3.11.5/Python-3.11.5.tar.xz

# 압축 해제
tar -xf Python-3.11.5.tar.xz

#압축 파일 삭제
rm -rf Python-3.11.5.tar.xz

'''
#빌드 및 설치
cd Python-3.11.5
./configure --enable-optimizations
make -j$(nproc)
sudo make altinstall
'''

#--enable-optimizations 옵션은 Python을 최적화된 상태로 빌드하도록 함

# python3.11 실행 파일의 우선순위 설정
sudo update-alternatives --install /usr/bin/python python /usr/local/bin/python3.11 1

# python3.11을기본 python으로 설정
sudo update-alternatives --set python /usr/local/bin/python3.11


# 파이썬 버전 확인
python --version # 3.11.5

#pip 버전 확인
pip3.11 --version

# pip를 pip3.11로 심볼릭 링크 설정
sudo ln -s /usr/local/bin/pip3.11 /usr/local/bin/pip

# ec2 재부팅 후 pip 버전 확인
pip --version

# 파이썬 폴더 삭제
sudo rm -rf Python-3.11.5

### 환경 세팅 완료


* 만약 pip install -r requirements.txt에서 Killed가 난다면, 메모리 부족해서 설치 못하는 것
pip install -r requirements.txt --no-cache-dir # --no-cache-dir 옵션을 이용해서 설치.

*pip cache 파일 삭제
pip cache purge

# venv 설치
sudo apt install python3-venv
python3 -m venv .venv



# mongoDB 설치
# 참고 : https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#import-the-public-key-used-by-the-package-management-system


# Import the public key used by the package management system
sudo apt-get install gnupg curl

curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
   --dearmor

# Create a list file for MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Reload local package database
sudo apt-get update

# install MongoDB packages
sudo apt-get install -y mongodb-org

# mongoDB 명령어
sudo systemctl start mongod
sudo systemctl status mongod
sudo systemctl enable mongod
sudo systemctl stop mongod
sudo systemctl restart mongod

# mongoDB 사용
mongosh

# DB 및 collection 추가
use project_name
db.createCollection("articles")
