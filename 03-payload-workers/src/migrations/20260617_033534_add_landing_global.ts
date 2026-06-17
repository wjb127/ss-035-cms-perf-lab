import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`landing_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`landing\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`landing_features_order_idx\` ON \`landing_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`landing_features_parent_id_idx\` ON \`landing_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`landing\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_badge\` text DEFAULT 'Cloudflare 엣지 CMS',
  	\`hero_title\` text DEFAULT '콘텐츠는 직접 수정하고, 속도는 엣지에 맡기세요' NOT NULL,
  	\`hero_subtitle\` text DEFAULT 'Payload + Cloudflare Workers로 만든 랜딩페이지. 관리자 패널에서 글·이미지를 바꾸면 전 세계 엣지에서 즉시 서빙됩니다.',
  	\`hero_primary_cta_text\` text DEFAULT '문의하기',
  	\`hero_primary_cta_url\` text DEFAULT '#contact',
  	\`hero_secondary_cta_text\` text DEFAULT '관리자 패널',
  	\`hero_secondary_cta_url\` text DEFAULT '/admin',
  	\`cta_section_title\` text DEFAULT '지금 바로 콘텐츠를 직접 관리해 보세요',
  	\`cta_section_button_text\` text DEFAULT '관리자 패널 열기',
  	\`cta_section_button_url\` text DEFAULT '/admin',
  	\`footer_text\` text DEFAULT '© 2026 CMS Perf Lab · Payload on Cloudflare Workers',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`landing_features\`;`)
  await db.run(sql`DROP TABLE \`landing\`;`)
}
