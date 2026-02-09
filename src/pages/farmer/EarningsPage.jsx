import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../hooks/useTranslation";
import Card from "../../components/ui/Card";
import { IndianRupee, TrendingUp, Calendar, Wallet } from "lucide-react";

const payouts = [
  { id: "P-1022", date: "Oct 08, 2025", amount: 12450, status: "processed" },
  { id: "P-1021", date: "Oct 01, 2025", amount: 17890, status: "processed" },
  { id: "P-1020", date: "Sep 24, 2025", amount: 15230, status: "processed" },
];

const FarmerEarnings = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-forest-800 dark:text-forest-100">
        {t("earningsDashboard")}
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5">
          <div className="text-forest-600 dark:text-forest-400 text-sm">{t("thisMonth")}</div>
          <div className="text-3xl font-semibold text-forest-800 dark:text-forest-100">₹62,430</div>
        </Card>
        <Card className="p-5">
          <div className="text-forest-600 dark:text-forest-400 text-sm">{t("pendingPayout")}</div>
          <div className="text-3xl font-semibold text-forest-800 dark:text-forest-100">₹8,750</div>
        </Card>
        <Card className="p-5 flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-success-600" />
          <div>
            <div className="text-forest-600 dark:text-forest-400 text-sm">{t("growth")}</div>
            <div className="text-xl font-semibold text-forest-800 dark:text-forest-100">+12% MoM</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center space-x-3">
          <Wallet className="w-6 h-6 text-forest-600 dark:text-forest-300" />
          <div>
            <div className="text-forest-600 dark:text-forest-400 text-sm">{t("nextPayout")}</div>
            <div className="text-xl font-semibold text-forest-800 dark:text-forest-100">Oct 12</div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-forest-200 dark:border-forest-700 flex items-center space-between">
          <div className="text-xl font-semibold text-forest-800 dark:text-forest-100 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>{t("recentPayouts")}</span>
          </div>
        </div>
        <div className="divide-y divide-forest-200 dark:divide-forest-700">
          {payouts.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-forest-800 dark:text-forest-100">{p.id}</div>
                <div className="text-forest-600 dark:text-forest-400 text-sm">{p.date}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-forest-800 dark:text-forest-100">₹{p.amount}</div>
                <div className="text-xs text-success-600 capitalize">{p.status}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FarmerEarnings;
