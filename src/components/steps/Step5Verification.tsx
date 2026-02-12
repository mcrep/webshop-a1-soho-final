import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateOIB } from "@/lib/utils";
import { Check, X, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VerificationData } from "@/types";

// Dummy data - will be replaced with API call later
const authorizedPersons = [
  { id: "1", firstName: "Ivan", lastName: "Horvat", oib: "12345678903" },
  { id: "2", firstName: "Ana", lastName: "Kovačević", oib: "98765432104" },
  { id: "3", firstName: "Marko", lastName: "Babić", oib: "45678901237" },
];

type Step5VerificationProps = {
  data: VerificationData | null;
  onUpdate: (data: VerificationData) => void;
  initialCompanyOib?: string;
};

export function Step5Verification({ data, onUpdate, initialCompanyOib }: Step5VerificationProps) {
  const [companyOib, setCompanyOib] = useState(data?.companyOib || initialCompanyOib || "");
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");
  const [personalOib, setPersonalOib] = useState(data?.authorizedPerson.oib || "");
  const [contactNumber, setContactNumber] = useState(data?.authorizedPerson.contactNumber || "");
  const [contactEmail, setContactEmail] = useState(data?.authorizedPerson.contactEmail || "");



  const isCompanyOibValid = companyOib.length === 11 && validateOIB(companyOib);
  const showDetails = isCompanyOibValid;
  const isPersonalOibValid = personalOib.length === 11 && validateOIB(personalOib);
  
  const selectedPerson = authorizedPersons.find(p => p.id === selectedPersonId);

  // Auto-fill OIB when person is selected
  useEffect(() => {
    if (selectedPerson) {
      setPersonalOib(selectedPerson.oib);
    }
  }, [selectedPerson]);

  useEffect(() => {
    if (isCompanyOibValid && selectedPerson && isPersonalOibValid && contactNumber && contactEmail) {
      onUpdate({
        companyOib,
        authorizedPerson: {
          firstName: selectedPerson.firstName,
          lastName: selectedPerson.lastName,
          oib: personalOib,
          contactNumber,
          contactEmail,
        },
      });
    }
  }, [companyOib, selectedPerson, personalOib, contactNumber, contactEmail, isCompanyOibValid, isPersonalOibValid, onUpdate]);

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
              <div className="md:col-span-2">
                <Label htmlFor="authorized-person">Ovlaštena osoba *</Label>
                <Select value={selectedPersonId} onValueChange={setSelectedPersonId}>
                  <SelectTrigger className="w-full mt-1.5">
                    <SelectValue placeholder="Odaberite ovlaštenu osobu" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {authorizedPersons.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.firstName} {person.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="personal-oib">OIB osobe *</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="personal-oib"
                    value={personalOib}
                    onChange={(e) => {
                      if (!selectedPerson) {
                        setPersonalOib(e.target.value.replace(/\D/g, "").slice(0, 11));
                      }
                    }}
                    placeholder="Unesite 11 znamenki OIB-a"
                    maxLength={11}
                    className="flex-1"
                    disabled={!!selectedPerson}
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

          <Alert className="border-primary/30 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription>
              Ovlaštena osoba bit će verificirana skeniranjem osobne iskaznice nakon završetka narudžbe.
            </AlertDescription>
          </Alert>

        </div>
      )}
    </div>
  );
}
