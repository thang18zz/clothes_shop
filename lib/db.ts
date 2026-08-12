import { Pool, QueryResult, QueryResultRow } from 'pg';

// Khởi tạo Pool kết nối PostgreSQL sử dụng cấu hình từ biến môi trường.
// Trong chế độ phát triển, tái sử dụng pool kết nối để tránh quá tải kết nối.
const globalForDb = global as unknown as { pool: Pool };

export const pool =
  globalForDb.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/clothes_shop',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Số lượng kết nối tối đa trong pool
    idleTimeoutMillis: 30000, // Thời gian ngắt kết nối rảnh rỗi (30s)
    connectionTimeoutMillis: 2000, // Timeout kết nối (2s)
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

/**
 * Hàm tiện ích thực hiện truy vấn cơ sở dữ liệu an toàn.
 * Hỗ trợ tham số hóa truy vấn để phòng chống SQL Injection.
 */
export async function dbQuery<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    
    // Log hiệu năng các truy vấn chạy chậm (> 100ms) trong chế độ phát triển
    if (process.env.NODE_ENV !== 'production' && duration > 100) {
      console.warn(`[Slow Query] ${text} - Duration: ${duration}ms`);
    }
    
    return res;
  } catch (error) {
    console.error('[Database Query Error]', { text, error });
    throw error;
  }
}
