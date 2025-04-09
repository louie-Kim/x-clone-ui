
/**
 * if the framework (next.js) refreshes the module responsible for exporting PrismaClient, 
 * this can result in additional, 
 * unwanted instances of PrismaClient in a development environment.
 * As a workaround, you can store PrismaClient as a 'global variable' in development environments only, 
 * as global variables are not reloaded:
 */
// next는 리로드 될때 마다 새로운  Client를 생성 -> 이거를 방지해야함.
/**
 * Prisma Client의 인스턴스를 '전역으로 재사용'할 수 있게 해주는 방식입니다. 
 * 특히 개발 환경이나 테스트 환경에서 Prisma Client를 계속 '재사용'하면서 
 * 성능 최적화와 메모리 문제를 방지하려는 목적이 있습니다.
 */
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
// instances가 이미 있으면  globalForPrisma.prisma(전역 인스턴스)를 사용하고 없으면 새로운 인스턴스를 생성
  globalForPrisma.prisma || new PrismaClient()
// production 환경이 아닐때만 (development | test) globalForPrisma.prisma를 사용하도록 설정
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


