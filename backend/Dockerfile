# ========================================================
# Dockerfile cho Spring Boot Backend - CinePrime Cinema
# ========================================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy cấu hình Maven và tải dependencies
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN mvn dependency:go-offline -B

# Copy mã nguồn và đóng gói JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Cài đặt curl để hỗ trợ healthcheck
RUN apk add --no-cache curl tzdata
ENV TZ=Asia/Ho_Chi_Minh

COPY --from=builder /app/target/cinemabooking-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8088
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
