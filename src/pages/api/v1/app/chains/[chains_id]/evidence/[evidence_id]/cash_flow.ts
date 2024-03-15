// 033 - GET /app/chains/:chain_id/evidence/:evidence_id/cash_flow

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../../../prisma/client';
import {ICashFlowResponse} from '../../../../../../../../interfaces/cash_flow_neo';
import {IEvidenceContent} from '../../../../../../../../interfaces/evidence';

type ResponseData = ICashFlowResponse | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const evidenceId = typeof req.query.evidence_id === 'string' ? req.query.evidence_id : undefined;

  // ToDo: (20240315 - Julian) 找出 30 天前的 evidenceId
  const previousEvidenceId = evidenceId;

  // ToDo: (20240315 - Julian) 找出去年的 evidenceId
  const lastYearEvidenceId = evidenceId;

  try {
    // Info: (20240315 - Julian) 從 evidences 撈出 current reports
    const currentReports = await prisma.evidences.findFirst({
      where: {
        evidence_id: evidenceId,
      },
      select: {
        content: true,
      },
    });
    // Info: (20240315 - Julian) 轉換成 object
    const currentReportsObj: IEvidenceContent = JSON.parse(currentReports?.content ?? '');
    // Info: (20240315 - Julian) 撈出 cashFlow
    const currentCash = currentReportsObj.cashFlow;

    // Info: (20240315 - Julian) 從 evidences 撈出 previous reports
    const previousReports = await prisma.evidences.findFirst({
      where: {
        evidence_id: previousEvidenceId,
      },
      select: {
        content: true,
      },
    });
    // Info: (20240315 - Julian) 轉換成 object
    const previousReportsObj: IEvidenceContent = JSON.parse(previousReports?.content ?? '');
    // Info: (20240315 - Julian) 撈出 cashFlow
    const previousCash = previousReportsObj.cashFlow;

    // Info: (20240315 - Julian) 從 evidences 撈出 last year reports
    const lastYearReports = await prisma.evidences.findFirst({
      where: {
        evidence_id: lastYearEvidenceId,
      },
      select: {
        content: true,
      },
    });
    // Info: (20240315 - Julian) 轉換成 object
    const lastYearReportsObj: IEvidenceContent = JSON.parse(lastYearReports?.content ?? '');
    // Info: (20240315 - Julian) 撈出 cashFlow
    const lastYearCash = lastYearReportsObj.cashFlow;

    const result: ICashFlowResponse = {
      currentReport: currentCash,
      previousReport: previousCash,
      lastYearReport: lastYearCash,
    };

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json(undefined);
  } finally {
    await prisma.$disconnect();
  }
}
