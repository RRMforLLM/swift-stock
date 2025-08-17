import db from '@/database/db';

// FETCHING DATA
export const getStores = async () => {
  const query = 'SELECT * FROM STORES';
  try {
    const result = await db.getAllAsync(query);
    return result;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

export const getUniforms = async () => {
  const query = 'SELECT * FROM UNIFORMS';
  try {
    const result = await db.getAllAsync(query);
    return result;
  } catch (error) {
    console.error('Error fetching uniforms:', error);
    throw error;
  }
};

export const getOperations = async () => {
  const query = `
    SELECT 
      o.id,
      o.operation,
      o.concept,
      o.quantity,
      o.date,
      s.id as store_id,
      s.name as store_name,
      u.id as uniform_id,
      u.type as uniform_type,
      u.size as uniform_size
    FROM OPERATIONS o
    JOIN STORES s ON o.store = s.id
    JOIN UNIFORMS u ON o.uniform = u.id
    ORDER BY o.date DESC
  `;
  try {
    const result = await db.getAllAsync(query);
    return result.map((row: any) => ({
      id: row.id,
      operation: row.operation === 1,
      concept: row.concept,
      quantity: row.quantity,
      date: row.date,
      store: {
        id: row.store_id,
        name: row.store_name
      },
      uniform: {
        id: row.uniform_id,
        type: row.uniform_type,
        size: row.uniform_size
      }
    }));
  } catch (error) {
    console.error('Error fetching operations:', error);
    throw error;
  }
};

// INSERTING DATA
export const insertStore = async ({
  name,
}: {
  name: string;
}): Promise<number> => {
  const query = 'INSERT INTO STORES (name) VALUES (?)';
  try {
    const result = await db.runAsync(query, [name]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting store:', error);
    throw error;
  }
};

export const insertUniform = async ({
  type,
  size,
}: {
  type: string;
  size: string;
}): Promise<number> => {
  const query = 'INSERT INTO UNIFORMS (type, size) VALUES (?, ?)';
  try {
    const result = await db.runAsync(query, [type, size]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting uniform:', error);
    throw error;
  }
};

export const insertOperation = async ({
  store,
  operation,
  concept,
  uniform,
  quantity,
  date,
}: {
  store: number;
  operation: boolean;
  concept: string;
  uniform: number;
  quantity: number;
  date: string;
}): Promise<number> => {
  const query = 'INSERT INTO OPERATIONS (store, operation, concept, uniform, quantity, date) VALUES (?, ?, ?, ?, ?, ?)';
  try {
    const result = await db.runAsync(query, [store, operation ? 1 : 0, concept, uniform, quantity, date]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting operation:', error);
    throw error;
  }
};

// DELETING DATA
export const deleteStore = async ({
  id,
}: {
  id: number;
}): Promise<void> => {
  const query = 'DELETE FROM STORES WHERE ID = ?';
  try {
    await db.runAsync(query, [id]);
  } catch (error) {
    console.error('Error deleting store:', error);
    throw error;
  }
};

export const deleteUniform = async ({
  id,
}: {
  id: number;
}): Promise<void> => {
  const query = 'DELETE FROM UNIFORMS WHERE ID = ?';
  try {
    await db.runAsync(query, [id]);
  } catch (error) {
    console.error('Error deleting uniform:', error);
    throw error;
  }
};

export const deleteOperation = async ({
  id,
}: {
  id: number;
}): Promise<void> => {
  const query = 'DELETE FROM OPERATIONS WHERE ID = ?';
  try {
    await db.runAsync(query, [id]);
  } catch (error) {
    console.error('Error deleting operation:', error);
    throw error;
  }
};
