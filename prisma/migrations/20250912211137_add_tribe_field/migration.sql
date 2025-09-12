-- AlterTable
ALTER TABLE "public"."Module" ALTER COLUMN "url" SET DEFAULT 'https://modulo.happytribe.ai';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "tribe" TEXT;
