<?php
// FILE: uniwiz-backend/config/database.php (DUAL DRIVER: SUPABASE PGSQL & LOCAL MYSQL)
// ====================================================================================

require_once __DIR__ . '/../vendor/autoload.php';

// Try loading root .env first, then uniwiz-backend .env
try {
    if (file_exists(__DIR__ . '/../../.env')) {
        $rootDotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..');
        $rootDotenv->safeLoad();
    }
    if (file_exists(__DIR__ . '/../.env')) {
        $backendDotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
        $backendDotenv->safeLoad();
    }
} catch (Exception $e) {
    // Continue if dotenv cannot load
}

class Database {
    public $conn;

    public function getConnection() {
        $this->conn = null;

        $dbUrl = $_ENV['DATABASE_URL'] ?? getenv('DATABASE_URL') ?? null;
        $directUrl = $_ENV['DIRECT_URL'] ?? getenv('DIRECT_URL') ?? null;
        $connectionUrl = $directUrl ?: $dbUrl;

        try {
            if ($connectionUrl && (strpos($connectionUrl, 'postgres://') === 0 || strpos($connectionUrl, 'postgresql://') === 0)) {
                // Parse PostgreSQL / Supabase connection URL
                $parts = parse_url($connectionUrl);
                $host = $parts['host'] ?? 'localhost';
                $port = $parts['port'] ?? 5432;
                $user = isset($parts['user']) ? urldecode($parts['user']) : 'postgres';
                $pass = isset($parts['pass']) ? urldecode($parts['pass']) : '';
                $dbname = isset($parts['path']) ? ltrim($parts['path'], '/') : 'postgres';

                $dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";
                $this->conn = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } else {
                // Fallback to MySQL
                $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?? 'localhost';
                $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?? '3306';
                $dbname = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?? 'uniwiz_db';
                $user = $_ENV['DB_USER'] ?? getenv('DB_USER') ?? 'root';
                $pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?? '';

                $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
                $this->conn = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
            }
        } catch (PDOException $exception) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "DATABASE CONNECTION ERROR: " . $exception->getMessage()
            ]);
            exit();
        }

        return $this->conn;
    }
}
?>
