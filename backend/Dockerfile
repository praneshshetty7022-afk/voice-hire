# Multi-stage Dockerfile for VoiceHire Spring Boot backend
# Stage 1: Build the packaged JAR
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build project with tests skipped for fast reproducible CI/CD
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime image using Eclipse Temurin Java 17
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Run as non-root user
RUN addgroup -S voicehire && adduser -S voicehire -G voicehire
USER voicehire

# Copy the built JAR from builder stage
COPY --from=builder /app/target/voicehire-backend-1.0.0.jar app.jar

# Dynamic PORT for cloud providers like Render (default fallback to 8082)
ENV PORT=8082
EXPOSE 8082

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
