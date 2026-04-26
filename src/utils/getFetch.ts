
import { ref } from 'vue';

//  返回接口
interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}
//  参数配置接口
interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  headers?: Record<string, string>,
  body?: any
}

const getFetch = async <T = any>(
  url: string = '',
  needToken: boolean = false,
  options: FetchOptions = {},
): Promise<ApiResponse<T> | Response | undefined> => {
  const { method = "GET", headers = {}, body = undefined } = options
  const error = ref('');
  const baseUrl = 'http://scj.dolmo.top:3001';
  const token = localStorage.getItem('token');

  //  处理请求头
  const fullHeaders = {
    ...headers,
    ...(needToken ? { Authorization: `Bearer ${token}` } : {}),
  };

  //  处理body
  let finalBody = body;
  if (body && headers['Content-Type'] == 'application/json') {
    finalBody = JSON.stringify(body);
  }

  // 请求配置
  const option: RequestInit = {
    method: method,
    headers: fullHeaders,
    ...(body ? { body: finalBody } : {}),
  };

  try {
    const response = await fetch(`${baseUrl}${url}`, option);
    if (response.status === 200) {
      //  流式路径
      if (url == '/api/chat/stream') {
        return response;
      }
      //  常规路径
      const data: ApiResponse<T> = await response.json();
      console.log(data);
      return data;
    } else {
      throw new Error('状态码错误');
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = String(err);
    }
    console.log('请求错误:', error.value);
  }

};

export default getFetch;
