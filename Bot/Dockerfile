FROM maven:3.9.8-amazoncorretto-21-al2023 as builder
COPY pom.xml /app/
COPY src /app/src
RUN mvn -f /app/pom.xml clean package

FROM eclipse-temurin:21-jre-jammy

EXPOSE ${PORT}

COPY --from=builder /app/target/*.jar /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]