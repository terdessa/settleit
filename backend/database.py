"""Database setup and models for storing disputes."""
import aiosqlite
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from pathlib import Path

DB_PATH = Path(__file__).parent / "settleit.db"


async def init_db():
    """Initialize the database with required tables."""
    async with aiosqlite.connect(DB_PATH) as db:
        # Disputes table
        await db.execute("""
            CREATE TABLE IF NOT EXISTS disputes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                type TEXT NOT NULL,
                description TEXT NOT NULL,
                creator_id TEXT NOT NULL,
                opponent_id TEXT NOT NULL,
                creator_position TEXT,
                opponent_position TEXT,
                validator_id TEXT,
                validator_type TEXT,
                status TEXT NOT NULL,
                stake_amount REAL NOT NULL,
                opponent_stake_amount REAL NOT NULL,
                token TEXT NOT NULL,
                deadline TEXT,
                evidence_requirements TEXT,
                created_at TEXT NOT NULL,
                funded_at TEXT,
                evidence_submitted_at TEXT,
                in_review_at TEXT,
                resolved_at TEXT,
                decision_winner TEXT,
                decision_reason TEXT,
                decision_decided_at TEXT,
                decision_decided_by TEXT
            )
        """)
        
        # Evidence table
        await db.execute("""
            CREATE TABLE IF NOT EXISTS evidence (
                id TEXT PRIMARY KEY,
                dispute_id TEXT NOT NULL,
                type TEXT NOT NULL,
                content TEXT NOT NULL,
                submitted_by TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                description TEXT,
                FOREIGN KEY (dispute_id) REFERENCES disputes(id)
            )
        """)
        
        await db.commit()


async def get_all_disputes() -> List[Dict[str, Any]]:
    """Get all disputes from the database."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM disputes ORDER BY created_at DESC")
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


async def get_dispute_by_id(dispute_id: str) -> Optional[Dict[str, Any]]:
    """Get a dispute by ID."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM disputes WHERE id = ?", (dispute_id,))
        row = await cursor.fetchone()
        return dict(row) if row else None


async def create_dispute(dispute_data: Dict[str, Any]) -> str:
    """Create a new dispute in the database."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            INSERT INTO disputes (
                id, title, type, description, creator_id, opponent_id,
                creator_position, opponent_position, validator_id, validator_type,
                status, stake_amount, opponent_stake_amount, token, deadline,
                evidence_requirements, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            dispute_data['id'],
            dispute_data['title'],
            dispute_data['type'],
            dispute_data['description'],
            dispute_data['creator_id'],
            dispute_data['opponent_id'],
            dispute_data.get('creator_position'),
            dispute_data.get('opponent_position'),
            dispute_data.get('validator_id'),
            dispute_data['validator_type'],
            dispute_data['status'],
            dispute_data['stake_amount'],
            dispute_data['opponent_stake_amount'],
            dispute_data['token'],
            dispute_data.get('deadline'),
            dispute_data.get('evidence_requirements'),
            dispute_data['created_at'],
        ))
        await db.commit()
        return dispute_data['id']


async def update_dispute(dispute_id: str, updates: Dict[str, Any]) -> bool:
    """Update a dispute in the database."""
    if not updates:
        return False
    
    set_clauses = []
    values = []
    
    for key, value in updates.items():
        if key == 'decision':
            # Handle decision object
            if value:
                set_clauses.append("decision_winner = ?")
                set_clauses.append("decision_reason = ?")
                set_clauses.append("decision_decided_at = ?")
                set_clauses.append("decision_decided_by = ?")
                values.extend([
                    value.get('winner'),
                    value.get('reason'),
                    value.get('decidedAt').isoformat() if value.get('decidedAt') else None,
                    value.get('decidedBy'),
                ])
            continue
        elif key == 'evidence':
            # Evidence is stored in separate table
            continue
        elif isinstance(value, datetime):
            set_clauses.append(f"{key} = ?")
            values.append(value.isoformat())
        else:
            set_clauses.append(f"{key} = ?")
            values.append(value)
    
    if not set_clauses:
        return False
    
    values.append(dispute_id)
    query = f"UPDATE disputes SET {', '.join(set_clauses)} WHERE id = ?"
    
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(query, values)
        await db.commit()
        return True


async def get_evidence_by_dispute(dispute_id: str) -> List[Dict[str, Any]]:
    """Get all evidence for a dispute."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM evidence WHERE dispute_id = ? ORDER BY timestamp",
            (dispute_id,)
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


async def add_evidence(evidence_data: Dict[str, Any]) -> str:
    """Add evidence to a dispute."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            INSERT INTO evidence (
                id, dispute_id, type, content, submitted_by, timestamp, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            evidence_data['id'],
            evidence_data['dispute_id'],
            evidence_data['type'],
            evidence_data['content'],
            evidence_data['submitted_by'],
            evidence_data['timestamp'],
            evidence_data.get('description'),
        ))
        await db.commit()
        return evidence_data['id']


async def delete_dispute(dispute_id: str) -> bool:
    """Delete a dispute and its evidence."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("DELETE FROM evidence WHERE dispute_id = ?", (dispute_id,))
        await db.execute("DELETE FROM disputes WHERE id = ?", (dispute_id,))
        await db.commit()
        return True

