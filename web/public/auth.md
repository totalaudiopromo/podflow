# Podflow Agent Authentication (Auth.md)

This document outlines the authentication and registration standards for AI agents interacting with **Podflow**.

## Overview

Podflow supports programmatic agent discovery, registration, and authentication via standard OAuth 2.0 (RFC 6749) and OAuth Protected Resource Metadata (RFC 9728).

- **Authorization Server:** `https://podflow.cc/.well-known/oauth-authorization-server`
- **Protected Resource:** `https://podflow.cc/.well-known/oauth-protected-resource`
- **OpenID Configuration:** `https://podflow.cc/.well-known/openid-configuration`

---

## Agent Registration

Agents can register dynamically or request API tokens for authorized API & MCP tool execution.

### Discovery Endpoints
- **Register URI:** `https://podflow.cc/oauth/register`
- **Claim URL:** `https://podflow.cc/oauth/claim`
- **Revocation URL:** `https://podflow.cc/oauth/revoke`

### Supported Identity Types
1. `agent`: Autonomous software agent or subagent runtime.
2. `user`: Human user account delegate.
3. `organization`: Enterprise PR agency or monitoring suite.

### Supported Credential Types
- `bearer_token`: OAuth 2.0 Bearer tokens transmitted via HTTP header (`Authorization: Bearer <token>`).
- `api_key`: Developer API key (`--api-key` parameter or `X-API-Key` header).
- `mtls`: Mutual TLS client certificates for enterprise deployments.

---

## Scopes & Permissions

| Scope | Description |
|---|---|
| `podflow:read` | Read public podcast summaries, transcripts, and guest profiles |
| `podflow:write` | Submit new RSS feeds or transcripts for AI analysis |
| `podflow:digest` | Access generated Markdown digests and knowledge graphs |
| `podflow:mcp` | Execute Model Context Protocol (MCP) server capabilities |

---

## Programmatic Authentication Flow

1. Discover authorization server metadata at `/.well-known/oauth-authorization-server`.
2. Inspect protected resource requirements at `/.well-known/oauth-protected-resource`.
3. Obtain Bearer Token via `POST /oauth/token` using `client_credentials` or `authorization_code`.
4. Include token in subsequent HTTP/SSE requests: `Authorization: Bearer <token>`.
