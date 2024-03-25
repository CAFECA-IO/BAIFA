// 032 - GET /app/chains/:chain_id/evidence/:evidence_id/comprehensive_income

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../../../prisma/client';
import {
  ComprehensiveIncomeNeoSchema,
  IComprehensiveIncomeResponse,
} from '../../../../../../../../interfaces/comprehensive_income_neo';
import {IEvidenceContent} from '../../../../../../../../interfaces/evidence';

type ResponseData = IComprehensiveIncomeResponse | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const evidenceId = typeof req.query.evidence_id === 'string' ? req.query.evidence_id : undefined;

  try {
    const currentReports = await prisma.evidences.findFirst({
      where: {evidence_id: evidenceId},
      select: {content: true},
    });

    const currentReportsObj: IEvidenceContent = JSON.parse(currentReports?.content ?? '{}');
    const currentIncomeValidationResult = ComprehensiveIncomeNeoSchema.safeParse(
      currentReportsObj.comprehensiveIncome
    );

    // eslint-disable-next-line no-console
    console.log(
      'currentReportsObj.comprehensiveIncome',
      currentReportsObj.comprehensiveIncome,
      'currentIncomeValidationResult',
      currentIncomeValidationResult
    );

    if (!currentIncomeValidationResult.success) {
      // eslint-disable-next-line no-console
      console.error('Validation failed for currentIncome', currentIncomeValidationResult.error);
      return res.status(400).json({} as IComprehensiveIncomeResponse);
    }

    const previousReports = await prisma.evidences.findFirst({
      where: {evidence_id: evidenceId}, // Adjust the query to fetch previous reports
      select: {content: true},
    });

    const previousReportsObj: IEvidenceContent = JSON.parse(previousReports?.content ?? '{}');
    const previousIncomeValidationResult = ComprehensiveIncomeNeoSchema.safeParse(
      previousReportsObj.comprehensiveIncome
    );

    if (!previousIncomeValidationResult.success) {
      // eslint-disable-next-line no-console
      console.error('Validation failed for previousIncome', previousIncomeValidationResult.error);
      return res.status(400).json({} as IComprehensiveIncomeResponse);
    }

    const lastYearReports = await prisma.evidences.findFirst({
      where: {evidence_id: evidenceId}, // Adjust the query to fetch last year reports
      select: {content: true},
    });

    const lastYearReportsObj: IEvidenceContent = JSON.parse(lastYearReports?.content ?? '{}');
    const lastYearIncomeValidationResult = ComprehensiveIncomeNeoSchema.safeParse(
      lastYearReportsObj.comprehensiveIncome
    );

    if (!lastYearIncomeValidationResult.success) {
      // eslint-disable-next-line no-console
      console.error('Validation failed for lastYearIncome', lastYearIncomeValidationResult.error);
      return res.status(400).json({} as IComprehensiveIncomeResponse);
    }
    // Repeat the process for previousIncome and lastYearIncome

    // Assuming you have fetched `previousReports` and `lastYearReports` similarly

    // If all validations pass, construct the response object
    const result: IComprehensiveIncomeResponse = {
      currentReport: currentIncomeValidationResult.data,
      previousReport: previousIncomeValidationResult.data, // Replace with validated data
      lastYearReport: lastYearIncomeValidationResult.data, // Replace with validated data
    };

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Server error', error);
    res.status(500).json({} as IComprehensiveIncomeResponse);
  } finally {
    await prisma.$disconnect();
  }
}
