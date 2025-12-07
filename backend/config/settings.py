"""Application settings and configuration."""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    # LLM Provider Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")

    # Default LLM Configuration
    DEFAULT_LLM_PROVIDER: str = os.getenv("DEFAULT_LLM_PROVIDER", "gemini")
    DEFAULT_MODEL: str = os.getenv("DEFAULT_MODEL", "gemini-2.5-pro")
    GEMINI_MAX_TOKENS: int = int(os.getenv("GEMINI_MAX_TOKENS", "20000"))

    # Web3 Configuration
    WEB3_PROVIDER_URL: str = os.getenv("WEB3_PROVIDER_URL", "")
    PRIVATE_KEY: str = os.getenv("PRIVATE_KEY", "")

    # Neo / NeoFS Configuration
    NEO_RPC_URL: str = os.getenv("NEO_RPC_URL", "https://n3seed2.ngd.network:20332")
    NEO_NETWORK_MAGIC: int = int(os.getenv("NEO_NETWORK_MAGIC", "894710606"))
    NEO_ESCROW_CONTRACT_HASH: str = os.getenv("NEO_ESCROW_CONTRACT_HASH", "")
    NEO_ORACLE_WIF: str = os.getenv("NEO_ORACLE_WIF", "")
    NEOFS_GATEWAY_URL: str = os.getenv("NEOFS_GATEWAY_URL", "")
    NEOFS_CONTAINER_ID: str = os.getenv("NEOFS_CONTAINER_ID", "")
    NEOFS_WALLET_WIF: str = os.getenv("NEOFS_WALLET_WIF", "")

    # Server Configuration
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    def get_available_provider(self) -> tuple[str, str]:
        """Get the first available LLM provider and its API key."""
        providers = [
            ("gemini", self.GEMINI_API_KEY),
            ("openai", self.OPENAI_API_KEY),
            ("anthropic", self.ANTHROPIC_API_KEY),
            ("deepseek", self.DEEPSEEK_API_KEY),
            ("openrouter", self.OPENROUTER_API_KEY),
        ]

        # Check if default provider has a key
        for provider, key in providers:
            if provider == self.DEFAULT_LLM_PROVIDER and key:
                return provider, key

        # Fall back to any available provider
        for provider, key in providers:
            if key:
                return provider, key

        raise ValueError("No LLM provider API key configured. Please set at least one API key in .env")


settings = Settings()
