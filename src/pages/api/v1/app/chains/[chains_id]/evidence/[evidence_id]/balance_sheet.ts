import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../../../prisma/client';
import {IBalanceSheetsResponse} from '../../../../../../../../interfaces/balance_sheets_neo';
import {IEvidenceContent} from '../../../../../../../../interfaces/evidence';

type ResponseData = IBalanceSheetsResponse | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const evidenceId = typeof req.query.evidence_id === 'string' ? req.query.evidence_id : undefined;

  // ToDo: (20240315 - Julian) 找出 30 天前的 evidenceId
  const previousEvidenceId = evidenceId;

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
    // Info: (20240315 - Julian) 撈出 balanceSheet
    const currentBalance = currentReportsObj.balanceSheet;

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
    // Info: (20240315 - Julian) 撈出 balanceSheet
    const previousBalance = previousReportsObj.balanceSheet;

    const result: IBalanceSheetsResponse = {
      currentReport: currentBalance,
      previousReport: previousBalance,
    };

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(undefined);
  } finally {
    await prisma.$disconnect();
  }
}
