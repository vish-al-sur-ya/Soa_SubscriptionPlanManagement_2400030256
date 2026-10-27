# CrudService — SubscriptionPlan Backend

Spring Boot REST API for the SubscriptionPlan CRUD exam project.

- Maven/Eclipse project name: `CrudService`
- Java base package: `com.klef.soa.exam`
- Service interface and implementation are both directly inside `com.klef.soa.exam.service`.
- Eureka client registration defaults to `http://localhost:8761/eureka/`.
- Uses file-based H2 by default; PostgreSQL can be configured with environment variables.

## Import into your existing Eclipse exam workspace
1. Extract this ZIP.
2. In Eclipse, choose **File → Import → Maven → Existing Maven Projects**.
3. Browse to the extracted folder containing `pom.xml`.
4. Select the project and click **Finish**.
5. Run `SubscriptionPlanApplication.java` as a Java Application.

## Swagger UI
http://localhost:8080/swagger-ui/index.html

## Endpoints
- `POST /Add` — create a plan
- `GET /DisplayAll` — list all plans
- `GET /Display/{id}` — get one plan
- `PUT /Update/{id}` — update a plan
- `DELETE /Delete/{id}` — delete a plan

## Example request body
```json
{
  "planName": "Basic",
  "monthlyCost": 499.0,
  "maxUsers": 10,
  "active": true
}
```

The database generates `id`. Request validation is applied directly to the entity. This simplified version intentionally has no DTO class, ApiError class, or custom ApiExceptionHandler.
