1. role_setting.sql 을 실행한다(스키마 생성)
2. 서버를 실행한다(스키마 하위에 테이블 생성)
3. role_setting2.sql을 실행한다(role 항목 생성)
4. 역할 변경이 필요한 경우, access_control.sql을 실행한다(default는 일반 USER)

Eng(How to activate spring pj for backend)
1. activate the query role_setting.sql
2. run the spring boot server, it will create the table required for the activation
3. activate the query role_setting2.sql to create the role
4. when the transition of role is needed, run the access_control.sql
