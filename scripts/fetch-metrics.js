#!/usr/bin/env node

/**
 * Скрипт получения актуальных метрик проекта.
 *
 * Вызывается из GitHub Actions workflow перед генерацией README.
 * Может обращаться к API мониторинга для получения реальных данных.
 *
 * Если API_URL и API_KEY не заданы — скрипт пропускается (continue-on-error: true).
 *
 * Использование:
 *   API_URL=https://api.example.com API_KEY=xxx node scripts/fetch-metrics.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "docs");
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

async function fetchMetrics() {
    if (!API_URL || !API_KEY) {
        console.log("ℹ️  API_URL или API_KEY не заданы — пропускаем получение метрик");
        console.log("   Используем данные по умолчанию из docs/dashboard-data.json");
        return;
    }

    console.log("📊 Получение метрик из API...");

    try {
        const response = await fetch(`${API_URL}/metrics`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const metrics = await response.json();

        // Читаем текущие данные
        const dashboardPath = path.join(DATA_DIR, "dashboard-data.json");
        const currentData = JSON.parse(fs.readFileSync(dashboardPath, "utf-8"));

        // Обновляем метрики (только те поля, которые пришли из API)
        const updated = {
            ...currentData,
            health: metrics.health ?? currentData.health,
            uptime: metrics.uptime ?? currentData.uptime,
            api_p95_ms: metrics.api_p95_ms ?? currentData.api_p95_ms,
            test_coverage: metrics.test_coverage ?? currentData.test_coverage,
            last_updated: new Date().toISOString(),
        };

        // Обновляем тренды если есть
        if (metrics.api_trend) {
            updated.api_trend = metrics.api_trend;
        }
        if (metrics.bugs_trend) {
            updated.bugs_trend = metrics.bugs_trend;
        }
        if (metrics.features_trend) {
            updated.features_trend = metrics.features_trend;
        }

        fs.writeFileSync(dashboardPath, JSON.stringify(updated, null, 4), "utf-8");
        console.log("✅ Метрики обновлены:");
        console.log(`   Health: ${updated.health}%`);
        console.log(`   Uptime: ${updated.uptime}%`);
        console.log(`   API p95: ${updated.api_p95_ms}ms`);
    } catch (error) {
        console.error("❌ Ошибка при получении метрик:", error.message);
        // Не прерываем CI — используем данные по умолчанию
        process.exit(0);
    }
}

fetchMetrics();