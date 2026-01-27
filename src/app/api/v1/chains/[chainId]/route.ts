import { NextRequest } from 'next/server';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chainId: string }> }
) {
  return forward(request, params);
}

async function forward(request: NextRequest, params: Promise<{ chainId: string }>) {
  const { chainId } = await params;

  // For now, we use the isuncoin mainnet as the default target,
  // but we can extend this to use chainId to determine other targets.
  const targetBaseUrl = process.env.ISUNCOIN_MAINNET_URL || 'https://mainnet.isuncoin.com';
  const targetUrl = new URL(targetBaseUrl);
  const requestUrl = new URL(request.url);

  // Preserve search params
  targetUrl.search = requestUrl.search;

  const headers = new Headers(request.headers);
  // Remove host header to avoid confusion at the target server
  headers.delete('host');

  let body: BodyInit | undefined;
  if (!['GET', 'HEAD'].includes(request.method)) {
    try {
      body = await request.arrayBuffer();
    } catch {
      // Body might be empty or unreadable
    }
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: headers,
      body: body,
      redirect: 'manual',
    });

    const contentType = response.headers.get('content-type');
    let payload: unknown;

    if (contentType && contentType.includes('application/json')) {
      try {
        payload = await response.json();
      } catch (err) {
        // Fallback to text if JSON parsing fails (common for empty response bodies)
        payload = await response.text();
        console.error('Failed to parse JSON response:', err);
      }
    } else {
      payload = await response.text();
    }

    if (response.ok) {
      return jsonOk(payload);
    } else {
      // Map common status codes to ApiCode if possible, otherwise use INTERNAL_SERVER_ERROR
      let code = ApiCode.INTERNAL_SERVER_ERROR;
      if (response.status === 400) code = ApiCode.VALIDATION_ERROR;
      if (response.status === 401) code = ApiCode.UNAUTHORIZED;
      if (response.status === 403) code = ApiCode.FORBIDDEN;
      if (response.status === 404) code = ApiCode.NOT_FOUND;
      if (response.status === 409) code = ApiCode.CONFLICT;
      if (response.status === 429) code = ApiCode.RATE_LIMIT;

      return jsonFail(code, `Upstream error (${chainId}): ${response.statusText}`, {
        status: response.status,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonFail(ApiCode.INTERNAL_SERVER_ERROR, `Proxy Error (${chainId}): ${message}`, {
      status: 502,
    });
  }
}
