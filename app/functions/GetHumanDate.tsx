import React from 'react'

function GetHumanDate(unixTimestamp: bigint, lang: string, timeZone: string): Date {
    // try {
    //     // Validation de la chaîne ISO
    //     if (!isoDate || typeof isoDate !== "bigint") {
    //         throw new Error("La date fournie n'est pas un BigInt valide.");
    //     }
        
    //     const date = new Date(Number(isoDate) * 1000); // Convertir en millisecondes et ajuster pour le fuseau horaire
    //     console.log("Converted Date Object:", date, isoDate, timeZone, new Date());

    //     // Vérification que la date est valide
    //     if (isNaN(date.getTime())) {
    //         throw new Error("Format de date unix invalide.");
    //     }

    //     // Options de formatage
    //     const options: Intl.DateTimeFormatOptions = {
    //         weekday: "long",   // Nom complet du jour
    //         year: "numeric",
    //         month: "long",     // Nom complet du mois
    //         day: "numeric",
    //         hour: "2-digit",
    //         minute: "2-digit",
    //         second: "2-digit",
    //         hour12: (lang === "fr" ? false : true), // Format 24h pour le français, 12h pour les autres langues
    //         // timeZone // Force le fuseau horaire
    //     };

    //     // Conversion en format lisible
    //     return date.toLocaleString(lang, options);
    //  } catch (error) {
    //       console.error(error)
    //       return `Une erreur s'est produite`;
    // }


    const timestamp =
    typeof unixTimestamp === "bigint"
      ? Number(unixTimestamp)
      : unixTimestamp;

  // Date UTC brute
  const date = new Date(timestamp * 1000);

  // On extrait l'heure locale DANS le timezone
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const getPart = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    getPart("hour"),
    getPart("minute"),
    getPart("second")
  );
}
export default GetHumanDate
