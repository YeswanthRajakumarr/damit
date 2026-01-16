import { test, expect } from "@playwright/test";

const MOCK_USER = {
    id: "test-user-id",
    email: "test@example.com",
    aud: "authenticated",
    role: "authenticated",
    app_metadata: {},
    user_metadata: { display_name: "Test User" },
    created_at: "2024-03-01T00:00:00Z",
};

const MOCK_SESSION = {
    access_token: "fake-token",
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "fake-refresh-token",
    user: MOCK_USER,
};

test.describe("DAMit! basic flow", () => {
    test.beforeEach(async ({ page }) => {
        // Mock Supabase Auth User
        await page.route("**/auth/v1/user", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(MOCK_USER),
            });
        });

        // Mock Supabase Auth Token
        await page.route("**/auth/v1/token?grant_type=password", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(MOCK_SESSION),
            });
        });

        // Mock Supabase Auth getSession (initial check)
        await page.route("**/auth/v1/token?grant_type=refresh_token", async (route) => {
            await route.fulfill({
                status: 400,
                contentType: "application/json",
                body: JSON.stringify({ error: "no session" }),
            });
        });

        // Mock Logs Fetch
        await page.route("**/rest/v1/daily_logs**", async (route) => {
            if (route.request().method() === "GET") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify([]),
                });
            } else if (route.request().method() === "POST" || route.request().method() === "PATCH" || route.request().method() === "PUT") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify({ id: "new-log-id" }),
                });
            }
        });
    });

    test("should login and complete a log", async ({ page }) => {
        await page.goto("/auth");

        await page.getByTestId("email-input").fill("test@example.com");
        await page.getByTestId("password-input").fill("password123");
        await page.getByTestId("auth-submit").click();

        await expect(page).toHaveURL("/", { timeout: 15000 });

        // Question 1: Diet (Rating)
        await expect(page.getByTestId("question-number")).toHaveText("Question 1", { timeout: 10000 });
        await page.getByTestId("rating-1").click(); // Perfect
        await page.waitForTimeout(600); // Auto-advance

        // Q2: Energy (Rating)
        await expect(page.getByTestId("question-number")).toHaveText("Question 2");
        await page.getByTestId("rating-1").click(); // Very High
        await page.waitForTimeout(600);

        // Q3: Stress (Rating)
        await expect(page.getByTestId("question-number")).toHaveText("Question 3");
        await page.getByTestId("rating-1").click(); // Nill
        await page.waitForTimeout(600);

        // Q4: Workout (Rating)
        await expect(page.getByTestId("question-number")).toHaveText("Question 4");
        await page.getByTestId("rating-1").click(); // Perfect
        await page.waitForTimeout(600);

        // Q5: Water (Rating)
        await expect(page.getByTestId("question-number")).toHaveText("Question 5");
        await page.getByTestId("rating-1").click(); // Perfect
        await page.waitForTimeout(600);

        // Q6: Sleep (Rating)
        await expect(page.getByTestId("question-number")).toHaveText("Question 6");
        await page.getByTestId("rating-1").click(); // Perfect
        await page.waitForTimeout(600);

        // Q7: Cravings (Rating)
        await expect(page.getByTestId("question-number")).toHaveText("Question 7");
        await page.getByTestId("rating-1").click(); // Nill
        await page.waitForTimeout(600);

        // Q8: Hunger (Rating)
        await expect(page.getByTestId("question-number")).toHaveText("Question 8");
        await page.getByTestId("rating-1").click(); // Nill
        await page.waitForTimeout(600);

        // Q9: 10K Goal (Rating: Yes=1)
        await expect(page.getByTestId("question-number")).toHaveText("Question 9");
        await page.getByTestId("rating-1").click();
        await page.waitForTimeout(600);

        // Q10: Good thing (Text)
        await expect(page.getByTestId("question-number")).toHaveText("Question 10");
        await page.getByTestId("text-input").fill("Had a great run!");
        await page.getByTestId("nav-next").click();

        // Q11: Step count (Number)
        await expect(page.getByTestId("question-number")).toHaveText("Question 11");
        await page.getByTestId("number-input").fill("12000");
        await page.getByTestId("nav-next").click();

        // Q12: Proud (Rating)
        await expect(page.getByTestId("question-number")).toHaveText("Question 12");
        await page.getByTestId("rating-1").click();
        await page.waitForTimeout(600);

        // Verify Completion
        await expect(page.getByText("Great job!")).toBeVisible({ timeout: 10000 });



        // Check for success toast
        await expect(page.getByText("DAMit! saved to database!")).toBeVisible();
    });

    test("should show records and open snapshot", async ({ page }) => {
        // Overwrite mock for this specific test
        await page.route("**/rest/v1/daily_logs**", async (route) => {
            if (route.request().method() === "GET") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify([{
                        id: "1",
                        log_date: new Date().toISOString().split('T')[0],
                        diet: 1,
                        energy_level: 1,
                        step_count: 10000,
                        good_thing: "Test Good Thing",
                        proud_of_yourself: "Yes"
                    }]),
                });
            } else {
                await route.continue();
            }
        });

        await page.goto("/auth");
        await page.getByTestId("email-input").fill("test@example.com");
        await page.getByTestId("password-input").fill("password123");
        await page.getByTestId("auth-submit").click();

        await page.waitForURL("/");
        await page.getByTestId("nav-logs").click();
        await expect(page).toHaveURL("/logs");

        // Check stats dashboard
        await expect(page.locator("text=Avg Diet")).toBeVisible();
        await expect(page.locator("text=1.0")).toBeVisible();

        // Click row to open snapshot
        await page.locator("table tbody tr").first().click();

        // Check modal
        await expect(page.locator("text=One Good Thing")).toBeVisible({ timeout: 10000 }); // Wait for lazy load
        await expect(page.locator('text="Test Good Thing"')).toBeVisible();
    });
});
