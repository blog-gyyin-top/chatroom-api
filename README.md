# 聊天室 api
## mysql
数据库设计都在 `app.sql` 里面，可以参考。
### mac mysql 运行
首先，本地安装 mysql，然后执行 `sudo /usr/local/MySQL/support-files/mysql.server start` 来启动 mysql。
然后执行 `/usr/local/MySQL/bin/mysql -u root -p`，输入密码后就可以登录到 mysql。

## 一些 sql 命令
- desc <表名>: 查看表结构
- drop table <表名>: 删除一张表
- source <sql文件路径>: 在db里面创建表

## 接口
### 用户
1. 登录
2. 注册
### 群聊
1. 创建群聊
2. 加入群聊


## 参考

[mysql 如何重置密码](https://www.cnblogs.com/guokaixin/p/6547306.html)
[mysql 安装](https://www.cnblogs.com/nickchen121/p/11145123.html)
