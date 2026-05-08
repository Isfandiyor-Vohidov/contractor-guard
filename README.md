# 🛡️ Contractor-Guard

> Secure, automated contract lifecycle management с активным "guarding" и верификацией выполнения.

**The Architect** — Intelligent Contract Protection System

---

## 👁️ Overview

**Contractor-Guard** — это современная платформа, которая полностью автоматизирует жизненный цикл контрактов между заказчиками и исполнителями.

Платформа выступает в роли **активного стража**: автоматически проверяет выполнение milestones, управляет escrow-платежами, следит за соблюдением условий и минимизирует юридические и финансовые риски.

### Основные возможности

- **Active Guarding Protocol** — интеллектуальная проверка выполнения этапов перед разблокировкой платежей
- **Автоматический AI-анализ контрактов** (извлечение milestones, рисков и ключевых условий)
- **Escrow & Milestone Payments** — безопасное хранение и условное освобождение средств
- **Real-time State Machine** — прозрачное отслеживание статуса контракта в реальном времени
- **Генерация отчётов и рекомендаций** по улучшению контракта
- **Row-Level Security** + строгие политики доступа
- **Serverless Edge Functions** для надёжной оркестрации

---

## ✨ Key Features

- **🤖 AI-Powered Analysis** — извлечение структуры контракта, рисков и milestones с помощью LLM
- **🔄 Smart State Transitions** — Draft → Active → Milestone Review → Guarded → Completed
- **💰 Escrow Management** — интеграция с платежами (Stripe-ready)
- **📄 Multi-format Support** — PDF, DOCX, TXT
- **📊 Dashboard & Analytics** — удобный интерфейс с графиками прогресса
- **🔒 Enterprise-grade Security** — Supabase RLS + permission guarding
- **⚡ High Performance** — Next.js 15 App Router + Tailwind + Framer Motion

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Backend & DB**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions)
- **AI**: AI-SDK + несколько провайдеров (OpenAI, Anthropic, Google и др.)
- **Документы**: pdf-parse, mammoth, LangChain / custom prompts
- **State Management**: Zustand
- **UI**: Lucide React, Recharts
- **Background Jobs**: Supabase Edge Functions (Deno)
