# Odoo 18.0 Community - Deployment Guide 🚀

Este repositorio contiene la configuración necesaria para desplegar **Odoo 18.0 Community** de forma gratuita, utilizando **Docker**, **Coolify** para la gestión del servidor y **ngrok** para el acceso público.

## 📋 Tabla de Contenidos
* [Descripción General](#descripción-general)
* [Requisitos Previos](#requisitos-previos)
* [Estructura del Proyecto](#estructura-del-proyecto)
* [Instalación Rápida](#instalación-rápida)
* [Configuración Detallada](#configuración-detallada)
    * [1. Docker](#1-docker)
    * [2. Coolify](#2-coolify)
    * [3. ngrok](#3-ngrok)
* [Solución de Problemas](#solución-de-problemas)

---

## 🔍 Descripción General
Este proyecto permite montar un entorno ERP completo con **coste cero**. La arquitectura se basa en:
- **Odoo 18.0** como núcleo del ERP.
- **PostgreSQL 16** como base de datos.
- **Coolify** como panel de control (alternativa a Heroku).
- **ngrok** para túneles HTTPS seguros sin necesidad de abrir puertos en el router.

## ✅ Requisitos Previos
* Servidor Linux (Ubuntu 22.04/24.04 recomendado).
* Mínimo **2GB RAM** (4GB recomendados).
* Docker y Docker Compose instalados.
* Una cuenta gratuita en [ngrok](https://ngrok.com).

## 📁 Estructura del Proyecto
```text
odoo-docker/
├── addons/             # Tus módulos personalizados (.gitkeep)
├── config/
│   └── odoo.conf       # Configuración del servidor Odoo
├── Dockerfile          # Imagen personalizada de Odoo 18
├── docker-compose.yml  # Orquestación de servicios
└── entrypoint.sh       # Script de inicio y espera de DB