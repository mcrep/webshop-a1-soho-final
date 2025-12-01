import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { validateOIB } from "@/lib/utils";
import { Check, X, Upload } from "lucide-react";
import type { VerificationData } from "@/types";

type Step5VerificationProps = {
  data: VerificationData | null;
  onUpdate: (data: VerificationData) => void;
};

export function Step5Verification({ data, onUpdate }: Step5VerificationProps) {
  const [companyOib, setCompanyOib] = useState(data?.companyOib || "");
  const [firstName, setFirstName] = useState(data?.authorizedPerson.firstName || "");
  const [lastName, setLastName] = useState(data?.authorizedPerson.lastName || "");
  const [personalOib, setPersonalOib] = useState(data?.authorizedPerson.oib || "");
  const [contactNumber, setContactNumber] = useState(data?.authorizedPerson.contactNumber || "");
  const [contactEmail, setContactEmail] = useState(data?.authorizedPerson.contactEmail || "");
  const [idCardFront, setIdCardFront] = useState<File | null>(data?.idCardFront || null);
  const [idCardBack, setIdCardBack] = useState<File | null>(data?.idCardBack || null);

  const isCompanyOibValid = companyOib.length === 11 && validateOIB(companyOib);
  const showDetails = isCompanyOibValid;
  const isPersonalOibValid = personalOib.length === 11 && validateOIB(personalOib);

  useEffect(() => {
    if (isCompanyOibValid && firstName && lastName && isPersonalOibValid && contactNumber && contactEmail && idCardFront && idCardBack) {
      onUpdate({
        companyOib,
        authorizedPerson: {
          firstName,
          lastName,
          oib: personalOib,
          contactNumber,
          contactEmail,
        },
        idCardFront,
        idCardBack,
      });
    }
  }, [companyOib, firstName, lastName, personalOib, contactNumber, contactEmail, idCardFront, idCardBack, isCompanyOibValid, isPersonalOibValid, onUpdate]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Verifikacija tvrtke</h2>
        <p className="text-muted-foreground">Molimo unesite podatke tvrtke za verifikaciju</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="company-oib">OIB tvrtke *</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="company-oib"
                value={companyOib}
                onChange={(e) => setCompanyOib(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="Unesite 11 znamenki OIB-a"
                maxLength={11}
                className="flex-1"
              />
              {companyOib.length === 11 && (
                <div className="flex items-center justify-center w-10 h-10 rounded-full">
                  {isCompanyOibValid ? (
                    <Check className="text-green-600" size={24} />
                  ) : (
                    <X className="text-red-600" size={24} />
                  )}
                </div>
              )}
            </div>
            {companyOib.length === 11 && !isCompanyOibValid && (
              <p className="text-sm text-red-600 mt-1">OIB nije matematički ispravan</p>
            )}
          </div>
        </div>
      </Card>

      {showDetails && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Podaci ovlaštene osobe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name">Ime *</Label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Unesite ime"
                />
              </div>
              <div>
                <Label htmlFor="last-name">Prezime *</Label>
                <Input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Unesite prezime"
                />
              </div>
              <div>
                <Label htmlFor="personal-oib">OIB osobe *</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="personal-oib"
                    value={personalOib}
                    onChange={(e) => setPersonalOib(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    placeholder="Unesite 11 znamenki OIB-a"
                    maxLength={11}
                    className="flex-1"
                  />
                  {personalOib.length === 11 && (
                    <div className="flex items-center justify-center w-8 h-8">
                      {isPersonalOibValid ? (
                        <Check className="text-green-600" size={20} />
                      ) : (
                        <X className="text-red-600" size={20} />
                      )}
                    </div>
                  )}
                </div>
                {personalOib.length === 11 && !isPersonalOibValid && (
                  <p className="text-sm text-red-600 mt-1">OIB nije matematički ispravan</p>
                )}
              </div>
              <div>
                <Label htmlFor="contact-number">Kontakt broj *</Label>
                <Input
                  id="contact-number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Unesite kontakt broj"
                  type="tel"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="contact-email">Kontakt email *</Label>
                <Input
                  id="contact-email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Unesite email adresu"
                  type="email"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Osobna iskaznica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id-front">Prednja strana *</Label>
                <div className="mt-2">
                  <label
                    htmlFor="id-front"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {idCardFront ? idCardFront.name : "Kliknite za upload"}
                      </p>
                    </div>
                    <input
                      id="id-front"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setIdCardFront(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="id-back">Stražnja strana *</Label>
                <div className="mt-2">
                  <label
                    htmlFor="id-back"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {idCardBack ? idCardBack.name : "Kliknite za upload"}
                      </p>
                    </div>
                    <input
                      id="id-back"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setIdCardBack(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
