-- Buat permissions jika belum ada
INSERT INTO Permission (permission, description) VALUES 
  ('news:create','Create news'),
  ('news:read','Read news'),
  ('news:update','Update news'),
  ('news:delete','Delete news'),
  ('news:list','List news')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Kaitkan ke role admin
INSERT INTO RolePermission (roleId, permissionId)
SELECT r.id, p.id FROM Role r JOIN Permission p ON p.permission IN ('news:create','news:read','news:update','news:delete','news:list')
WHERE r.role IN ('admin','superadmin')
ON DUPLICATE KEY UPDATE permissionId=p.id;
