---
title: 【转】用批处理修改注册表权限
tags:
  - 批处理
  - 权限
  - 注册表
id: 22
categories:
  - 批处理
date: 2013-03-19 23:53:56
---

格式其实很简单，不过需要用echo输出一个.ini文件，然后用regini导入该文件

```
@echo off
if exist regset.ini @del /q /f regset.ini
echo HKEY_CURRENT_USERSoftwareMicrosoftInternet ExplorerMain [1 8 19] >regset.ini
regini regset.ini
@del /q /f regset.ini
pause
```

Regini 命令行下修改注册表以及注册表权限

使用方法

```
C:>regini regset.ini

HKEY_LOCAL_MACHINESOFTWAREMicrosoftWindowsCurrentVersionRun [17]
```

把run项设为只允许system控制 其他用户不可控制 [17] 为控制参数 其他参数看帮助

```
1 - Administrators Full Access
2 - Administrators Read Access
3 - Administrators Read and Write Access
4 - Administrators Read, Write and Delete Access
5 - Creator Full Access
6 - Creator Read and Write Access
7 - World Full Access
8 - World Read Access
9 - World Read and Write Access
10 - World Read, Write and Delete Access
11 - Power Users Full Access
12 - Power Users Read and Write Access
13 - Power Users Read, Write and Delete Access
14 - System Operators Full Access
15 - System Operators Read and Write Access
16 - System Operators Read, Write and Delete Access
17 - System Full Access
18 - System Read and Write Access
19 - System Read Access
20 - Administrators Read, Write and Execute Access
21 - Interactive User Full Access
22 - Interactive User Read and Write Access
23 - Interactive User Read, Write and Delete Access
```

更改ＲＵＮ为只读

```
HKEY_LOCAL_MACHINESoftwareMicrosoftWindowsCurrentVersionRun [2 8 19]
HKEY_CURRENT_USERSoftwareMicrosoftWindowsCurrentVersionRun [2 8 19]
```
