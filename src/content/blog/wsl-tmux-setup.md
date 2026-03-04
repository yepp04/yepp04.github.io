---
title: "WSL + tmux 개발 환경 세팅 완전 정복 feat: Claude Code 에이전트 팀"
description: "Windows에서 리눅스 개발 환경을 구축하고, tmux로 터미널을 효율적으로 관리하는 방법을 정리합니다."
date: "2026-03-04"
tags: ["개발환경", "wsl", "tmux", "claude-code"]
draft: false
---

## Windows 개발자의 고민

Windows에서 개발하다 보면 한 번쯤 이런 생각을 합니다.

> "맥 사야 하나..."

Node.js, Docker, Git 같은 도구들이 리눅스/맥 환경에 최적화되어 있고, 터미널 경험도 Windows CMD나 PowerShell로는 한계가 있죠. 하지만 WSL(Windows Subsystem for Linux)이 나오면서 상황이 완전히 달라졌습니다.

WSL2를 쓰면 **Windows 위에서 진짜 리눅스**를 돌릴 수 있습니다. 가상머신처럼 무겁지도 않고, 파일 시스템도 자연스럽게 공유됩니다. 여기에 tmux를 더하면 터미널 하나로 여러 작업을 동시에 관리할 수 있습니다.

## Windows Terminal 설치

기본 CMD나 PowerShell은 탭도 없고, 폰트도 별로고, 복사/붙여넣기도 불편합니다. 먼저 Microsoft Store에서 **Windows Terminal**을 설치하세요. 이미 설치되어 있을 수도 있습니다.

Windows Terminal의 주요 단축키:

| 단축키 | 동작 |
|--------|------|
| `Ctrl+Shift+T` | 새 탭 |
| `Ctrl+Shift+W` | 탭 닫기 |
| `Ctrl+Tab` | 다음 탭 |
| `Ctrl+Shift+Tab` | 이전 탭 |
| `Alt+Shift+D` | 화면 분할 |

Windows Terminal만으로도 기본 CMD보다 훨씬 쾌적합니다. 여기에 WSL과 tmux를 더하면 진짜 개발 환경이 완성됩니다.

## WSL2 설치

### 1단계: WSL 활성화

Windows Terminal을 관리자 권한으로 열고 다음 명령어를 실행합니다.

```powershell
wsl --install
```

이 한 줄이면 WSL2 + Ubuntu가 자동으로 설치됩니다. 재부팅 후 Ubuntu 터미널이 열리면서 사용자 이름과 비밀번호를 설정하게 됩니다.

### 2단계: Windows Terminal 기본 프로필을 Ubuntu로 변경

Ubuntu가 설치되었으니 Windows Terminal의 기본 쉘을 바꿔줍니다.

1. Windows Terminal 실행
2. 상단 드롭다운 `∨` → **설정** (또는 `Ctrl+,`)
3. **시작** → **기본 프로필**을 `Ubuntu`로 변경
4. 저장

이제 Windows Terminal을 열면 바로 Ubuntu 쉘이 뜹니다.

### 3단계: 버전 확인

```bash
# WSL 버전 확인
wsl -l -v

# 출력 예시
  NAME      STATE           VERSION
* Ubuntu    Running         2
```

VERSION이 2인지 확인하세요. 1이라면 다음 명령으로 변환합니다.

```powershell
wsl --set-version Ubuntu 2
```

### 4단계: 기본 패키지 업데이트

```bash
sudo apt update && sudo apt upgrade -y
```

## 필수 도구 설치

### Node.js (nvm으로 관리)

시스템 패키지 매니저로 Node.js를 설치하면 버전 관리가 어렵습니다. nvm을 사용하면 프로젝트별로 다른 Node.js 버전을 쉽게 전환할 수 있습니다.

```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 터미널 재시작 후
nvm install --lts
nvm use --lts

# 확인
node -v  # v24.x.x
npm -v
```

### Git 설정

WSL에 Git은 기본 설치되어 있지만, 설정이 필요합니다.

```bash
git config --global user.name "이름"
git config --global user.email "이메일"

# 줄바꿈 처리 (Windows-Linux 호환)
git config --global core.autocrlf input

# 기본 브랜치명
git config --global init.defaultBranch main
```

### GitHub CLI

GitHub 인증과 저장소 관리를 터미널에서 바로 할 수 있습니다.

```bash
sudo apt install gh -y
gh auth login
```

브라우저 인증 방식을 선택하면 가장 간편합니다.

## tmux: 터미널 멀티플렉서

### tmux가 필요한 이유

개발할 때 터미널을 여러 개 사용하는 건 흔한 일입니다.

- 개발 서버 실행
- Git 작업
- 테스트 실행
- 로그 확인

탭을 여러 개 열어도 되지만, tmux를 쓰면 **하나의 터미널 안에서 화면을 분할**하고 **세션을 유지**할 수 있습니다. SSH 연결이 끊겨도 작업이 그대로 살아있다는 것이 가장 큰 장점입니다.

### 설치

```bash
sudo apt install tmux -y
tmux -V  # tmux 3.4
```

### 핵심 개념 3가지

tmux는 세 가지 계층으로 구성됩니다.

```
Session (세션)
 └── Window (윈도우) = 탭
      └── Pane (패인) = 분할된 화면
```

- **Session**: 작업 단위. 프로젝트별로 하나씩
- **Window**: 세션 안의 탭. 용도별로 분리
- **Pane**: 윈도우 안에서 화면 분할

### 기본 사용법

```bash
# 새 세션 생성
tmux new -s blog

# 세션에서 빠져나오기 (세션은 유지됨)
# Ctrl+b → d

# 세션 목록 확인
tmux ls

# 세션 다시 들어가기
tmux attach -t blog

# 세션 종료
tmux kill-session -t blog
```

### 자주 쓰는 단축키

tmux의 모든 단축키는 프리픽스 키 `Ctrl+b`를 먼저 누른 후 실행합니다.

#### 패인(화면 분할)

| 단축키 | 동작 |
|--------|------|
| `Ctrl+b` → `%` | 세로 분할 |
| `Ctrl+b` → `"` | 가로 분할 |
| `Ctrl+b` → 방향키 | 패인 이동 |
| `Ctrl+b` → `x` | 현재 패인 닫기 |
| `Ctrl+b` → `z` | 현재 패인 전체화면 토글 |
| `Ctrl+b` → `Alt+1` | 모든 패인 가로 균등 분할 |
| `Ctrl+b` → `Alt+2` | 모든 패인 세로 균등 분할 |
| `Ctrl+b` → `Space` | 레이아웃 순환 (균등 배치 포함) |

#### 윈도우(탭)

| 단축키 | 동작 |
|--------|------|
| `Ctrl+b` → `c` | 새 윈도우 생성 |
| `Ctrl+b` → `n` | 다음 윈도우 |
| `Ctrl+b` → `p` | 이전 윈도우 |
| `Ctrl+b` → 숫자 | 해당 번호 윈도우로 이동 |
| `Ctrl+b` → `,` | 윈도우 이름 변경 |

### 실전 워크플로우 예시

블로그 작업을 할 때 이런 식으로 구성합니다.

```bash
# 세션 생성
tmux new -s blog

# 윈도우 0: 개발 서버 (세로 분할)
npm run dev          # 왼쪽: 개발 서버
# Ctrl+b → % 로 세로 분할
                     # 오른쪽: 파일 편집

# Ctrl+b → c 로 새 윈도우
# 윈도우 1: Git 작업
git status
git add .
git commit -m "새 글 추가"
git push
```

화면 구성이 이렇게 됩니다.

- **윈도우 0 (dev)**: 세로 분할 — 왼쪽에 `npm run dev`, 오른쪽에 파일 편집
- **윈도우 1 (git)**: 분할 없이 — git 작업 전용

`Ctrl+b` → `0`이나 `1`을 눌러 윈도우 간 전환하면서 작업합니다.

### tmux 설정 커스터마이징

기본 설정도 괜찮지만, 몇 가지 변경하면 훨씬 편해집니다. `~/.tmux.conf` 파일을 만들어주세요.

```bash
# 마우스 지원 활성화
set -g mouse on

# 프리픽스 키 변경 (Ctrl+b → Ctrl+a)
# Ctrl+a가 손이 더 편합니다
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# 패인 분할 단축키를 직관적으로 변경
bind | split-window -h    # | 키로 세로 분할
bind - split-window -v    # - 키로 가로 분할

# 패인 이동을 vim 스타일로
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# 인덱스 1부터 시작 (0은 키보드 왼쪽 끝이라 불편)
set -g base-index 1
setw -g pane-base-index 1

# 설정 리로드 단축키
bind r source-file ~/.tmux.conf \; display "설정 리로드 완료!"
```

설정 파일을 저장한 후 적용합니다.

```bash
# tmux 안에서 설정 리로드
tmux source-file ~/.tmux.conf
```

## VS Code 연동

VS Code의 Remote - WSL 확장을 설치하면 WSL 파일 시스템을 네이티브처럼 사용할 수 있습니다.

```bash
# WSL 터미널에서 VS Code 열기
code .

# 특정 파일 열기
code src/content/blog/new-post.md
```

이렇게 열면 VS Code가 자동으로 WSL 모드로 연결됩니다. 터미널도 WSL 쉘이 기본으로 열립니다.

## 파일 시스템 팁

WSL에서 주의할 점이 하나 있습니다. **Windows 파일 시스템(`/mnt/c/`)보다 Linux 파일 시스템(`~/`)이 훨씬 빠릅니다.**

```bash
# 느림 - Windows 파일 시스템
cd /mnt/c/projects/my-app
npm install  # 체감상 2~3배 느림

# 빠름 - Linux 파일 시스템
cd ~/projects/my-app
npm install  # 네이티브 리눅스 속도
```

프로젝트 파일은 가능하면 `~/` 아래에 두는 것을 추천합니다. 다만 Windows 앱(탐색기, VS Code 등)에서 접근이 필요하다면 `/mnt/c/`에 두는 것도 충분히 괜찮습니다. 체감 차이가 크지 않은 작업도 많으니까요.

## 자주 겪는 문제와 해결

### WSL 디스크 용량 관리

WSL2는 가상 디스크(VHDX) 파일을 사용합니다. 파일을 삭제해도 VHDX 크기가 바로 줄어들지는 않는데, 일반적인 사용에서는 신경 쓸 필요 없습니다. 수십 GB 이상 쌓여서 디스크가 부족할 때만 아래 명령으로 정리하면 됩니다.

```powershell
# PowerShell (관리자)에서 실행
wsl --shutdown
diskpart
# DISKPART에서:
# select vdisk file="C:\Users\{사용자}\AppData\Local\Packages\{Ubuntu}\LocalState\ext4.vhdx"
# compact vdisk
```

### clipboard 공유가 안 됨

tmux 안에서 복사한 텍스트가 Windows 클립보드로 안 가는 경우가 있습니다.

```bash
# ~/.tmux.conf에 추가
bind -T copy-mode-vi y send-keys -X copy-pipe-and-cancel "clip.exe"
```

### 시간이 안 맞음

WSL 시계가 Windows와 동기화되지 않는 경우가 있습니다.

```bash
# 시간 동기화
sudo hwclock -s
```

## 마무리

WSL + tmux 조합은 Windows에서 리눅스 개발 환경을 구축하는 가장 효율적인 방법입니다.

- **WSL2**: Windows에서 네이티브 리눅스 환경
- **tmux**: 하나의 터미널로 여러 작업 관리, 세션 유지
- **VS Code Remote**: IDE와 자연스럽게 연동

한번 세팅해두면 맥 부럽지 않은 개발 환경을 만들 수 있습니다. 처음에는 tmux 단축키가 어색하지만, 일주일만 쓰면 없이는 못 살게 됩니다.

### 보너스: 이 세팅이 진짜 필요한 이유 — Claude Code 에이전트 팀

사실 제가 WSL + tmux를 쓰는 가장 큰 이유는 **Claude Code의 에이전트 팀(Agent Teams)** 기능 때문입니다.

Claude Code는 Anthropic에서 만든 AI 코딩 도구인데, 터미널에서 동작합니다. 그중 에이전트 팀은 여러 AI 에이전트를 동시에 띄워서 각각 독립적인 작업을 수행하게 하는 기능입니다. 예를 들어:

- **에이전트 A**: 프론트엔드 컴포넌트 작성
- **에이전트 B**: 백엔드 API 구현
- **에이전트 C**: 테스트 코드 작성

이 세 에이전트가 tmux 분할 창에서 각각 돌아가면서, 서로 메시지를 주고받고, 공유 작업 목록을 통해 조율합니다. 한 사람이 코딩하는 속도가 아니라, 팀 단위로 병렬 작업이 가능해지는 거죠.

문제는 이 기능이 **tmux 위에서 돌아간다**는 것입니다. Claude Code 자체가 Linux/macOS 전용이고, 분할 창 모드는 tmux가 필수입니다. Windows 사용자 입장에서는 결국 이 글에서 다룬 세팅이 전부 필요합니다.

```
Windows Terminal → WSL2 (Ubuntu) → tmux → Claude Code 에이전트 팀
```

이 파이프라인이 완성되면 Windows에서도 AI 에이전트 팀을 풀로 활용할 수 있습니다. 에이전트 팀의 구체적인 사용법과 실전 워크플로우는 [다음 글](/blog/claude-code-agent-teams)에서 자세히 다루겠습니다.
